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


interface Food {
  value: string;
  viewValue: string;
}

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
  rowspan = 9;
  species: Specie[] = [];
  breeds: Breed[] = [];
  form!: FormGroup;
  petToEdit!: Pet;
  insert = true;
  backendURL = environment.backendPetZocialURL;
  loadMyPicture = "/assets/load-my-picture.png";
  selectedSex = "";

  constructor(
    private speciesService: SpeciesService,
    private petsService: PetsService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private _utilsService: UtilsService,
    
  ) { 
  }

  ngOnInit(): void {
    this.loadSpecies();
    this.form = this.formBuilder.group({
      name: ["", Validators.required],
      human: ["", Validators.required],
      specie: ["", Validators.required],
      breed: [""],
      sex: [""],
      comment: [""],
      address: [""],
      birthday: [""],
      image: [this.loadMyPicture]
    });
    this.route.params.subscribe(async (params: any) => {
      if(params.id){
        this.insert = false;
        this.petToEdit = await this.petsService.getPet(params.id);
        this.selectedSpecieChanged(this.petToEdit.specie.specieId);   //HZUMAETA es importante para cargar un combo dependiente
        console.log(this.petToEdit, "edicion", this.form, this.breeds,"bredddds");

        // const imagePath = this.petToEdit.petImage?.url ?  this.backendURL + this.petToEdit.petImage.url : this.petToEdit.petImage.url;
        const imagePath = this.petToEdit?.petImage?.url;

        this.form.setValue({
          name: this.petToEdit.name,
          human: this.petToEdit.human || "",
          comment: this.petToEdit.comment,
          address: this.petToEdit.address || "",
          specie: this.petToEdit.specie.specieId || "",
          breed: this.petToEdit.breed.breedId || "",
          sex: this.petToEdit.sex || "",
          birthday: this.petToEdit.birthday || "",
          image: imagePath ?  (this.backendURL + imagePath) : this.loadMyPicture
        });
      }
    });
  }

  async loadSpecies() {
    this.species = await this.speciesService.getSpecies();
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
      "human": this.form.value.human,
      "comment": this.form.value.comment,
      "address": this.form.value.address,
      "sex": this.form.value.sex,
      "birthday": this.form.value.birthday,
      "specie": {specieId: this.form.value.specie, name: specieName},
      "breed":  {breedId: this.form.value.breed, name: breedName},
    }
    const petResult = this.insert ? await this.petsService.insertPet(pet) : await this.petsService.updatePet(this.petToEdit.id, pet);
    if (petResult){
      this._utilsService.showMessage("Pet's data was successfully updated");
      if(this.insert){
        this.router.navigate(["/master"]);
      }
    }
  }
  cargarImagen() {
    this.fileInput.nativeElement.click();
  }
  manejarCambioImagen(event: Event) {
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
  
}

