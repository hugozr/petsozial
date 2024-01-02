
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
import { Human } from '../../../../interfaces/human';
import { HumansService } from '../../../../services/humans.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-human-01',
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
  templateUrl: './human-01.component.html',
  styleUrl: './human-01.component.css'
})
export class Human01Component {
  @ViewChild('fileInput') fileInput: any;
  
  rowspan = 10;
  myForm!: FormGroup;
  humanToEdit!: Human;

  humanId: string = "";

  LATITUDE_PATTERN = environment.LATITUDE_PATTERN;
  LONGITUDE_PATTERN = environment.LONGITUDE_PATTERN;

  constructor(
    private humansService: HumansService,
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
        this.humanId = params.id;
        this.humanToEdit = await this.humansService.getHuman(params.id);
        console.log(this.humanToEdit);
        this.myForm.setValue({
          lat: this.humanToEdit.coordinates.x || 0,
          lng: this.humanToEdit.coordinates.y || 0,
          field1:"",
          field2:"",
        });
    });
  }
  async saveHuman() {
    const humanData: any = {
      "coordinates": {"x": this.myForm.value.lat, "y": this.myForm.value.lng},
    }
    const humanResult =  await this.humansService.updateHuman(this.humanToEdit.id, humanData);
    if (humanResult) {
      this._utilsService.showMessage("Human's data was successfully updated", 2000, true);
    }
  }
}


