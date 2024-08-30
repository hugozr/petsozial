

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UtilsService } from '../../../../services/utils.service';
import { environment } from '../../../../../environments/environment';
import { Vet } from '../../../../interfaces/vet';
import { VetsService } from '../../../../services/vets.service';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../../services/auth.service';

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
    RouterLink,
    MatIconModule
  ],
  templateUrl: './veterinary.component.html',
  styleUrl: './veterinary.component.css'
})
export class VeterinaryComponent {
  @ViewChild('fileInput') fileInput: any;
  rowspan = 11;
  myForm!: FormGroup;
  vetToEdit!: Vet;
  insert = true;

  vetId: string = "";
  vetTypes: any = [];
  vetTypeForEdit!: string; 

  backendURL = environment.backendPetZocialURL;
  loadMyPicture = "/assets/load-my-vet-picture.png";

  constructor(
    private vetsService: VetsService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private _utilsService: UtilsService,
    private _authService: AuthService,
  ) {
    this.myForm = this.formBuilder.group({
      name: ["", Validators.required],
      comment: [""],
      address: ["", Validators.required],
      vetType: [""],
      url: [""],
      phone: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      image: [this.loadMyPicture]
    });

  }

  async ngAfterViewInit() {
    
  }

  async ngOnInit(): Promise<void> {
    if(!this._authService.isLoggedIn()){
      this.router.navigate(['/pet-health']);
      return;
    }

    //HZUMAETA: Tiene que ir aca sino sale un error.
    this.vetTypes = await this.vetsService.getVetTypes();
    this.route.params.subscribe(async (params: any) => {
      if (params.id) {
        this.vetId = params.id;
        this.insert = false;
        this.vetToEdit = await this.vetsService.getVet(params.id);
        this.vetTypeForEdit = this.vetToEdit.vetType.id;
        const imagePath = this.vetToEdit?.vetImage?.url;
        this.myForm.setValue({
          name: this.vetToEdit.name,
          comment: this.vetToEdit.comment,
          phone: this.vetToEdit.phone,
          email: this.vetToEdit.email,
          url: this.vetToEdit.url || "",
          vetType: this.vetToEdit.vetType,
          address: this.vetToEdit.address || "",
          image: imagePath ? (this.backendURL + imagePath) : this.loadMyPicture
        });
      }
    });
  }
  async saveVet() {
    const vet: Vet = {
      "name": this.myForm.value.name,
      "comment": this.myForm.value.comment,
      "address": this.myForm.value.address,
      "phone": this.myForm.value.phone,
      "email": this.myForm.value.email,
      "url": this.myForm.value.url,
      "vetType": this.myForm.value.vetType,
      "kcUserName": this._authService.getUserName()
    }
    const vetResult = this.insert ? await this.vetsService.insertVet(vet) : await this.vetsService.updateVet(this.vetToEdit.id, vet);
    if (vetResult) {
      this._utilsService.showMessage("Vet's data was successfully updated", 2000, true);
      if (this.insert) {
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
    if (archivo) {
      const lector = new FileReader();
      lector.onload = async () => {
        if (!this.insert) {
          const media: any = { file: archivo, alt: this.vetToEdit.name, objId: this.vetToEdit.id }
          const uploadedFile: any = await this._utilsService.uploadFile(media);
          const updatedPet = await this.vetsService.patchVet(this.vetToEdit.id, { "vetImage": uploadedFile.doc.id });
          if (updatedPet) this._utilsService.showMessage("The vet's image has been successfully updated", 2000, true);
        }
        this.myForm.patchValue({
          image: lector.result
        });
      };
      lector.readAsDataURL(archivo);
    }
  }
}


