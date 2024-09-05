import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UtilsService } from '../../../../services/utils.service';
import { environment } from '../../../../../environments/environment';
import { Petshop } from '../../../../interfaces/petshop';
import { PetshopsService } from '../../../../services/petshops.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-pet-shop-01',
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
  templateUrl: './pet-shop-01.component.html',
  styleUrl: './pet-shop-01.component.css'
})
export class PetShop01Component {
  @ViewChild('fileInput') fileInput: any;
  
  rowspan = 10;
  myForm!: FormGroup;
  petshopToEdit!: Petshop;

  petshopId: string = "";

  LATITUDE_PATTERN = environment.LATITUDE_PATTERN;
  LONGITUDE_PATTERN = environment.LONGITUDE_PATTERN;

  constructor(
    private petshopsService: PetshopsService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private _utilsService: UtilsService,
  ) {
    const latValidator: ValidatorFn = this._utilsService.createPatternValidator(
      this.LATITUDE_PATTERN,
      'Enter a valid latitude.',
      'invalidLat'
    );
    
    const lngValidator: ValidatorFn = this._utilsService.createPatternValidator(
      this.LONGITUDE_PATTERN,
      'Enter a valid longitude.',
      'invalidLng'
    );
    this.myForm = this.formBuilder.group({
      lat: ["", [Validators.required, Validators.compose([Validators.pattern(this.LATITUDE_PATTERN), latValidator])]],
      lng: ["", [Validators.required, Validators.compose([Validators.pattern(this.LONGITUDE_PATTERN), lngValidator])]],
      field1: [""],
      field2: [""],
    });
  }

  async ngAfterViewInit() {
    
  }
  async ngOnInit(): Promise<void> {
    

    this.route.params.subscribe(async (params: any) => {
        this.petshopId = params.id;
        this.petshopToEdit = await this.petshopsService.getPetshop(params.id);
        console.log(this.petshopToEdit);
        this.myForm.setValue({
          lat: this.petshopToEdit.coordinates.x || 0,
          lng: this.petshopToEdit.coordinates.y || 0,
          field1:"",
          field2:"",
        });
    });
  }
  async savePetshop() {
    const petshopData: any = {
      "coordinates": {"x": this.myForm.value.lat, "y": this.myForm.value.lng},
    }
    const petshopResult =  await this.petshopsService.updatePetshop(this.petshopToEdit.id, petshopData);
    if (petshopResult) {
      this._utilsService.showMessage("Petshop's data was successfully updated", 2000, true);
    }
  }
}


