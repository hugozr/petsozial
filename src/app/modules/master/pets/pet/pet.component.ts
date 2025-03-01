import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SpeciesService } from '../../../../services/species.service';
import { Specie } from '../../../../interfaces/specie';
import { Breed } from '../../../../interfaces/breed';
import { Pet } from '../../../../interfaces/pet';
import { PetsService } from '../../../../services/pets.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from '../../../../services/utils.service';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { environment } from '../../../../../environments/environment';
import { MatIconModule } from '@angular/material/icon';
import { PetToHumanComponent } from './pet-to-human/pet-to-human.component';
import { MatDialog } from '@angular/material/dialog';
import { HumansService } from '../../../../services/humans.service';
import { ZonesService } from '../../../../services/zones.service';

@Component({
  selector: 'app-pet',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatCardModule,
    MatGridListModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './pet.component.html',
  styleUrl: './pet.component.css'
})
export class PetComponent {
  @ViewChild('fileInput') fileInput: any;
  rowspan = 10;
  species: Specie[] = [];
  breeds: Breed[] = [];
  form!: FormGroup;
  petToEdit!: Pet;
  insert = true;
  backendURL = environment.backendPetZocialURL;
  loadMyPicture = "/assets/load-my-pet-picture.png";
  selectedGender = "";
  actualHumanId = "";

  constructor(
    private speciesService: SpeciesService,
    private petsService: PetsService,
    private humansService: HumansService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private _utilsService: UtilsService,
    public dialog: MatDialog,
    private zonesService: ZonesService,
  ) {
    this.form = this.formBuilder.group({
      name: ["", Validators.required],
      humanName: ["", Validators.required],
      hiddenHumanId: [""],
      hiddenHumanEmail: [""],
      specie: ["", Validators.required],
      breed: [""],
      gender: [""],
      comment: [""],
      address: [""],
      birthday: [""],
      image: [this.loadMyPicture]
    });
  }

  async ngOnInit(): Promise<void> {
    await this.loadSpecies();
    this.route.params.subscribe(async (params: any) => {
      if(params.id){
        this.insert = false;
        this.petToEdit = await this.petsService.getPet(params.id);
        this.actualHumanId = this.petToEdit.human.humanId;
        this.selectedSpecieChanged(this.petToEdit.specie.specieId);   //HZUMAETA es importante para cargar un combo dependiente
        const imagePath = this.petToEdit?.petImage?.url;
        this.form.setValue({
          name: this.petToEdit.name,
          humanName: this.petToEdit.human.name || "",
          hiddenHumanId: this.petToEdit.human.humanId || "",
          hiddenHumanEmail: this.petToEdit.human.email || "",
          comment: this.petToEdit.comment,
          address: this.petToEdit.address || "",
          specie: this.petToEdit.specie.specieId || "",
          breed: this.petToEdit.breed.breedId || "",
          gender: this.petToEdit.gender || "",
          birthday: this.petToEdit.birthday || "",
          image: imagePath ?  (this.backendURL + imagePath) : this.loadMyPicture
        });
      }
    });
  }

  async loadSpecies() {
    this.species = await this.speciesService.getSpecies();
    // console.log(this.species, "que habrá?")
  }

  selectedSpecieChanged(specieId: string) {
    const result = this.species.find(item => item.id === specieId);
    if (result) {
      this.breeds = result.breeds;
    } else {
      console.log("Elemento no encontrado");
    }
  }

  async savePet() {
    const specieName = this._utilsService.search(this.species, "id", "name", this.form.value.specie);
    const breedName = this._utilsService.search(this.breeds, "id", "name", this.form.value.breed);
    const pet: Pet = {
      "name": this.form.value.name,
      "human": {"name": this.form.value.humanName, "humanId": this.form.value.hiddenHumanId, "email": this.form.value.hiddenHumanEmail  },
      "comment": this.form.value.comment,
      "address": this.form.value.address,
      "gender": this.form.value.gender,
      "birthday": this.form.value.birthday,
      "specie": {specieId: this.form.value.specie, name: specieName},
      "breed":  {breedId: this.form.value.breed, name: breedName},
    }
    if(this.insert) pet.zone = this.zonesService.getCurrentZone();
    const petResult: any = this.insert ? await this.petsService.insertPet(pet) : await this.petsService.updatePet(this.petToEdit.id, pet);
    if (petResult){
      let assigned = null;
      console.log(this.form.value.hiddenHumanId, this.actualHumanId, "ver ambos " )
      if(this.form.value.hiddenHumanId != this.actualHumanId && !this.insert ){   //Si se ha asignado un humano a la mascota
        // if(this.form.value.hiddenHumanId.length>0 && !this.insert && ){   //Si se ha asignado un humano a la mascota
        assigned = this.humansService.assignHumanToPet(this.form.value.hiddenHumanId, petResult.doc.id);
        this.actualHumanId = this.form.value.hiddenHumanId;
      }
      this._utilsService.showMessage("Pet's data was successfully updated" + (assigned ? ", with its human.":""),2000,true);
      if(this.insert){
        this.router.navigate(["/master"]);
      }
    }
  }
  loadImage() {
    this.fileInput.nativeElement.click();
  }
  changeImage(event: Event) {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];
    console.log(archivo);
    if (archivo) {
      const lector = new FileReader();
      lector.onload = async () => {
        if(!this.insert){
          const media: any  = {file: archivo, alt: this.petToEdit.name, objId:this.petToEdit.id }
          const uploadedFile: any = await this._utilsService.uploadFile(media);
          const updatedPet = await this.petsService.patchPet(this.petToEdit.id,{"petImage": uploadedFile.doc.id});
          if(updatedPet) this._utilsService.showMessage("The pet's image has been successfully updated");
        }
        this.form.patchValue({
          image: lector.result
        });
      };
      lector.readAsDataURL(archivo);
    }
  }
  asignHuman(){
    const dialogRef = this.dialog.open(PetToHumanComponent, {
      width: '400px',
      height: "400px",
      data: this.petToEdit,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if(result) {
        console.log(result)
        this.form.get('humanName')?.setValue(result.name);
        this.form.get('hiddenHumanId')?.setValue(result.id);
        this.form.get('hiddenHumanEmail')?.setValue(result.email);
        
      }
    });
  }
}

