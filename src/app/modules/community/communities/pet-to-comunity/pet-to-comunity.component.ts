import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HumansService } from '../../../../services/humans.service';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '../../../../../environments/environment';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UtilsService } from '../../../../services/utils.service';
import { CommunitiesService } from '../../../../services/communities.service';
import { AuthService } from '../../../../services/auth.service';
import { SettingsService } from '../../../../services/settings.service';

@Component({
  selector: 'app-pet-to-comunity',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
  ],
  
  templateUrl: './pet-to-comunity.component.html',
  styleUrl: './pet-to-comunity.component.css'
})
export class PetToComunityComponent {
  email: string = '';
  human: any = null;
  form!: FormGroup;
  petsForAddToCommunity: any[] = [];
  backendURL = environment.backendPetZocialURL;
  refreshMembers = false;
  messageAboutHuman = "";
  noImagePath = "";
  
  constructor(
    private dialogRef: MatDialogRef<PetToComunityComponent>,
    private formBuilder: FormBuilder,
    private humansService: HumansService,
    private communitiesService: CommunitiesService,
    private _utilsServices: UtilsService,
    private _authService: AuthService,
    public settingsService: SettingsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    const email = this._authService.getUserEmail() || "";
    this.form = this.formBuilder.group({
      email: [email, [Validators.required, Validators.email]],
    });
  }

  async ngOnInit(): Promise<void> {
    const settings: any = await this.settingsService.getSettings();
    this.noImagePath = settings.noImage.sizes.thumbnail.url;
  }
  
  async findPetsByHuman(){
    const email = this.form.get("email")?.value;
    let imagePath = "";
    const humanPets: any = await this.humansService.getPetsByHumanEmail(email);

    this.petsForAddToCommunity = [];
    if (humanPets.human) {
      this.human = humanPets.human;
      if(humanPets.pets.length != 0){
        for (const pet of humanPets.pets) {
          imagePath = pet.petImage?.sizes?.thumbnail?.url;
          imagePath = imagePath ? imagePath : this.noImagePath
          const isMember = await this.petIsMember(this.data.communityId, pet.id); 
          this.petsForAddToCommunity.push(
            {
              "petId": pet.id, 
              "name": pet.name,
              "thumbnail": imagePath ? (this.backendURL + imagePath) : null,
              "comment": pet.comment,
              "breed": pet.breed.name,
              "toAdd": !isMember
            });
        };
      } else {
        this.messageAboutHuman = "Human without associated pets";
      }
    } else {
      this.messageAboutHuman = "There is no human associated with this email account";
    }
  }

  async petIsMember(communityId: string, petId: string){
    const members: any = await this.communitiesService.petIsMember(communityId, petId);
    return members[0] ? true : false;
  }
  getShortenedComment(comment: string, maxLength: number): string {
    return this._utilsServices.getShortenedComment(comment,maxLength);
  }

  async AddPetToCommnity(pet: any){
    const data: any =  {community: this.data.communityId, pet: pet.petId};
    const added = await this.communitiesService.insertPetMember(data);
    if (added){
        this._utilsServices.showMessage("Pet successfully associated", 2000, true);
        this.refreshMembers = true;
        pet.toAdd = false;
    }
  }

  close() {
    this.dialogRef.close(this.refreshMembers);
  }
}
