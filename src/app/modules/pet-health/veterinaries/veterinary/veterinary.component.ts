

import { Component, ElementRef, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators  } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from '../../../../services/utils.service';
import { environment } from '../../../../../environments/environment';
import { Vet } from '../../../../interfaces/vet';
import { VetsService } from '../../../../services/vets.service';



@Component({
  selector: 'app-veterinary',
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
  ],
  templateUrl: './veterinary.component.html',
  styleUrl: './veterinary.component.css'
})
export class VeterinaryComponent {
  @ViewChild('fileInput') fileInput: any;
  rowspan = 9;
  form!: FormGroup;
  vetToEdit!: Vet;
  insert = true;
  backendURL = environment.backendPetZocialURL;
  loadMyPicture = "/assets/load-my-vet-picture.png";

  constructor(
    private vetsService: VetsService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private _utilsService: UtilsService,
    
  ) { 
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ["", Validators.required],
      comment: [""],
      address: ["", Validators.required],
      phone: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      image: [this.loadMyPicture]
    });
    this.route.params.subscribe(async (params: any) => {
      if(params.id){
        this.insert = false;
        this.vetToEdit = await this.vetsService.getVet(params.id);
        const imagePath = this.vetToEdit?.vetImage?.url;

        this.form.setValue({
          name: this.vetToEdit.name,
          comment: this.vetToEdit.comment,
          phone: this.vetToEdit.phone,
          email: this.vetToEdit.email,
          address: this.vetToEdit.address || "",
          image: imagePath ?  (this.backendURL + imagePath) : this.loadMyPicture
        });
      }
    });
  }
  async saveVet() {
    const vet: Vet = {
      "name": this.form.value.name,
      "comment": this.form.value.comment,
      "address": this.form.value.address,
      "phone": this.form.value.phone,
      "email": this.form.value.email,
    }
    const petResult = this.insert ? await this.vetsService.insertVet(vet) : await this.vetsService.updateVet(this.vetToEdit.id, vet);
    if (petResult){
      this._utilsService.showMessage("Vet's data was successfully updated");
      if(this.insert){
        this.router.navigate(["/pet-health"]);
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
          const media: any  = {file: archivo, alt: this.vetToEdit.name, objId:this.vetToEdit.id }
          const uploadedFile: any = await this._utilsService.uploadFile(media);
          const updatedPet = await this.vetsService.patchVet(this.vetToEdit.id,{"vetImage": uploadedFile.doc.id});
          if(updatedPet) this._utilsService.showMessage("The vet's image has been successfully updated");
        } 
        this.form.patchValue({
          image: lector.result
        });
      };
      lector.readAsDataURL(archivo);
    }
  }
  
}


