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
    this.myForm = this.formBuilder.group({
      name: ["", Validators.required],
      comment: [""],
      address: ["", Validators.required],
      type: [""],
      url: [""],
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
      "type": this.myForm.value.type.id,
    }
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


