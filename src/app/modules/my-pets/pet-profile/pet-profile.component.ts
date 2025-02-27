import { Component, Inject, ViewChild } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ImageUploaderComponent } from "../../../panels/image-uploader/image-uploader.component";
import { environment } from '../../../../environments/environment';
import { PetContactHumanComponent } from '../pet-contact-human/pet-contact-human.component';
import { HumanRolesService } from '../../../services/humanRoles.service';
import { PetHumanGridComponent } from "../pet-human-grid/pet-human-grid.component";

@Component({
  selector: 'app-pet-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatButtonModule,
    ImageUploaderComponent,
    PetHumanGridComponent
  ],
  templateUrl: './pet-profile.component.html',
  styleUrl: './pet-profile.component.css'
})
export class PetProfileComponent {
  showContactGrid = false;
  petHumans: any = [];
  activeUser: any = null;
  initialImagePath: string | null = 'http://localhost:3001/media/candy-1024x772.jpg';
  backendURL = environment.backendPetZocialURL;

  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public humanRolesServices: HumanRolesService,
  ) { }

  async ngOnInit() {
    this.initialImagePath = this.backendURL + this.data.petImage.url
  }

  async selectAPetHuman() {
    const dialogRef = this.dialog.open(PetContactHumanComponent, {
      width: '650px',
      height: "400px",
      data: this.data
    });

    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result) {
        const petData = {
          name: this.data.name,
          specieName: this.data.specie.name,
          breedName: this.data.breed.name,
          petImageUrl: this.data.petImage.url
        };
        const humanData = {
          nickName: result.humanData.nickName,
          email: result.humanData.email,
          humanImageUrl: result.humanData.humanImage?.url,
        }
        const contact = await this.humanRolesServices.setPetContactHuman(result.humanData.id, this.data.id, result.roles, { petData, humanData });
      
        this.showContactGrid = false;
        await this.getContacts();
      }
    });
  }

  async getContacts() {
    if (this.showContactGrid) return;
    this.petHumans = [];  
    const contacts = await this.humanRolesServices.getHumansByPet(this.data.id);
    contacts.forEach((item: any) => {
      this.petHumans.push(item.humanData)
    });
    this.showContactGrid = true;
  }

  async handleImageLoaded(imageId: string) {
    // const user = await this.usersServices.setUserImage(this.activeUser.id, imageId);
  }
}
