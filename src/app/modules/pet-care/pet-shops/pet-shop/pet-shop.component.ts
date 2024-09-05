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
import { Petshop } from '../../../../interfaces/petshop';
import { PetshopsService } from '../../../../services/petshops.service';

@Component({
  selector: 'app-pet-shop',
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
    RouterLink
  ],
  templateUrl: './pet-shop.component.html',
  styleUrl: './pet-shop.component.css'
})
export class PetShopComponent {
  @ViewChild('fileInput') fileInput: any;
  rowspan = 11;
  myForm!: FormGroup;
  petshopToEdit!: Petshop;
  insert = true;
  petshopId: string = "";

  petshopTypes: any = [];
  petshopTypeForEdit!: string; 

  backendURL = environment.backendPetZocialURL;
  loadMyPicture = "/assets/load-my-care-picture.png";

  constructor(
    private petshopsService: PetshopsService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private _utilsService: UtilsService,
  ) {
    this.myForm = this.formBuilder.group({
      name: ["", Validators.required],
      comment: [""],
      address: ["", Validators.required],
      petshopType: [""],
      url: [""],
      phone: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      image: [this.loadMyPicture]
    });
  }

  async ngAfterViewInit() {
    
  }
  async ngOnInit(): Promise<void> {
    

    //HZUMAETA: Tiene que ir aca sino sale un error.
    this.petshopTypes = await this.petshopsService.getPetshopTypes();
    this.route.params.subscribe(async (params: any) => {
      if (params.id) {
        this.petshopId = params.id;
        this.insert = false;
        this.petshopToEdit = await this.petshopsService.getPetshop(params.id);
        this.petshopTypeForEdit = this.petshopToEdit.petshopType.id;
        const imagePath = this.petshopToEdit?.petshopImage?.url;
        this.myForm.setValue({
          name: this.petshopToEdit.name,
          comment: this.petshopToEdit.comment,
          phone: this.petshopToEdit.phone,
          email: this.petshopToEdit.email,
          url: this.petshopToEdit.url || "",
          petshopType: this.petshopToEdit.petshopType,
          address: this.petshopToEdit.address || "",
          image: imagePath ? (this.backendURL + imagePath) : this.loadMyPicture
        });
      }
    });
  }
  async savePetshop() {
    const petshop: Petshop = {
      "name": this.myForm.value.name,
      "comment": this.myForm.value.comment,
      "address": this.myForm.value.address,
      "phone": this.myForm.value.phone,
      "email": this.myForm.value.email,
      "url": this.myForm.value.url,
      "petshopType": this.myForm.value.petshopType,
    }
    const petshopResult = this.insert ? await this.petshopsService.insertPetshop(petshop) : await this.petshopsService.updatePetshop(this.petshopToEdit.id, petshop);
    if (petshopResult) {
      this._utilsService.showMessage("Petshop's data was successfully updated", 2000, true);
      if (this.insert) {
        this.router.navigate(["/pet-care"]);
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
          const media: any = { file: archivo, alt: this.petshopToEdit.name, objId: this.petshopToEdit.id }
          const uploadedFile: any = await this._utilsService.uploadFile(media);
          const updatedPet = await this.petshopsService.patchPetshop(this.petshopToEdit.id, { "petshopImage": uploadedFile.doc.id });
          if (updatedPet) this._utilsService.showMessage("The petshop's image has been successfully updated", 2000, true);
        }
        this.myForm.patchValue({
          image: lector.result
        });
      };
      lector.readAsDataURL(archivo);
    }
  }
}