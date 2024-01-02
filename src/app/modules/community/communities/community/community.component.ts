import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from '../../../../services/utils.service';
import { environment } from '../../../../../environments/environment';
import { Vet } from '../../../../interfaces/vet';
import { Community } from '../../../../interfaces/community';
import { CommunitiesService } from '../../../../services/communities.service';

@Component({
  selector: 'app-community',
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
  templateUrl: './community.component.html',
  styleUrl: './community.component.css'
})
export class CommunityComponent {
  @ViewChild('fileInput') fileInput: any;
  rowspan = 8;
  myForm!: FormGroup;
  commToEdit!: Community;
  communityTypeForEdit!: string;
  insert = true;

  types: any = [];

  backendURL = environment.backendPetZocialURL;
  loadMyPicture = "/assets/load-my-community-picture.png";

  LATITUDE_PATTERN = environment.LATITUDE_PATTERN;
  LONGITUDE_PATTERN = environment.LONGITUDE_PATTERN;

  constructor(
    private communitiesService: CommunitiesService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private _utilsService: UtilsService,
  ) {
  }

  async ngAfterViewInit() {
    this.types = await this.communitiesService.getCommunityTypes();
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
      name: ["", Validators.required],
      comment: [""],
      address: ["", Validators.required],
      type: [""],
      url: [""],
      lat: ["", [Validators.required, Validators.compose([Validators.pattern(this.LATITUDE_PATTERN), latValidator])]],
      lng: ["", [Validators.required, Validators.compose([Validators.pattern(this.LONGITUDE_PATTERN), lngValidator])]],
      image: [this.loadMyPicture]
    });



    this.route.params.subscribe(async (params: any) => {
      if (params.id) {
        this.insert = false;
        this.commToEdit = await this.communitiesService.getCommunity(params.id);
        this.communityTypeForEdit = this.commToEdit.type?.id;
        const imagePath = this.commToEdit?.communityImage?.url;

        this.myForm.setValue({
          name: this.commToEdit.name,
          comment: this.commToEdit.comment,
          url: this.commToEdit.url || "",
          type: this.commToEdit.type || "",
          address: this.commToEdit.address || "",
          lat: this.commToEdit.coordinates.x || 0,
          lng: this.commToEdit.coordinates.y || 0,
          image: imagePath ? (this.backendURL + imagePath) : this.loadMyPicture
        });
      }
    });
  }
  async saveCommunity() {
    const community: Community = {
      "name": this.myForm.value.name,
      "comment": this.myForm.value.comment,
      "address": this.myForm.value.address,
      "url": this.myForm.value.url,
      "type": this.myForm.value.type,
      "coordinates": {"x": this.myForm.value.lat, "y": this.myForm.value.lng},
    }
    console.log(community,"esto va a actualziar");
    const communityResult = this.insert ? await this.communitiesService.insertCommunity(community) : await this.communitiesService.updateCommunity(this.commToEdit.id, community);
    if (communityResult) {
      this._utilsService.showMessage("Community's data was successfully updated", 2000, true);
      if (this.insert) {
        this.router.navigate(["/community"]);
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
          const media: any = { file: archivo, alt: this.commToEdit.name, objId: this.commToEdit.id }
          const uploadedFile: any = await this._utilsService.uploadFile(media);
          const updatedPet = await this.communitiesService.patchCommunity(this.commToEdit.id, { "vetImage": uploadedFile.doc.id });
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


