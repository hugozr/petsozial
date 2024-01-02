// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-veterinary-01',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './veterinary-01.component.html',
//   styleUrl: './veterinary-01.component.css'
// })
// export class Veterinary01Component {

// }




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
import { Vet } from '../../../../interfaces/vet';
import { VetsService } from '../../../../services/vets.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-veterinary-01',
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
  templateUrl: './veterinary-01.component.html',
  styleUrl: './veterinary-01.component.css'
})
export class Veterinary01Component {
  @ViewChild('fileInput') fileInput: any;
  
  rowspan = 10;
  myForm!: FormGroup;
  vetToEdit!: Vet;

  vetId: string = "";

  LATITUDE_PATTERN = environment.LATITUDE_PATTERN;
  LONGITUDE_PATTERN = environment.LONGITUDE_PATTERN;

  constructor(
    private vetsService: VetsService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private _utilsService: UtilsService,
  ) {
  }

  async ngAfterViewInit() {
    
  }
  async ngOnInit(): Promise<void> {
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

    this.route.params.subscribe(async (params: any) => {
        this.vetId = params.id;
        this.vetToEdit = await this.vetsService.getVet(params.id);
        this.myForm.setValue({
          lat: this.vetToEdit.coordinates.x || 0,
          lng: this.vetToEdit.coordinates.y || 0,
          field1:"",
          field2:"",
        });
    });
  }
  async saveVet() {
    const vetData: any = {
      "coordinates": {"x": this.myForm.value.lat, "y": this.myForm.value.lng},
    }
    const vetResult =  await this.vetsService.updateVet(this.vetToEdit.id, vetData);
    if (vetResult) {
      this._utilsService.showMessage("Vet's data was successfully updated", 2000, true);
    }
  }
  
}


