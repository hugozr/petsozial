import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PetsService } from '../../../../services/pets.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HumansService } from '../../../../services/humans.service';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '../../../../../environments/environment';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UtilsService } from '../../../../services/utils.service';
import { CommunitiesService } from '../../../../services/communities.service';
import { AuthService } from '../../../../services/auth.service';

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
  founded: any = null;
  form!: FormGroup;
  petsForAddToCommunity: any[] = [];
  backendURL = environment.backendPetZocialURL;
  refreshMembers = false;
  messageAboutHuman = "";
  
  constructor(
    private dialogRef: MatDialogRef<PetToComunityComponent>,
    private formBuilder: FormBuilder,
    private humansService: HumansService,
    private communitiesService: CommunitiesService,
    private _utilsServices: UtilsService,
    private _authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    //TODO Documentar por defecto se muestra el correo del usuario que tiene el login
    const email = this._authService.getUserEmail() || "";
    this.form = this.formBuilder.group({
      email: [email, [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    
  }
  
  async findPetsByHuman(){
    const email = this.form.get("email")?.value;
    const humans: any = await this.humansService.getHumansByEmail(email);
    if (humans.length != 0) {
      this.founded = humans[0];
      if(this.founded.pets){
        this.founded.pets.map((pet: any) => {
          const imagePath = pet.petImage?.sizes?.thumbnail?.url;
          this.petsForAddToCommunity.push(
            {
              "petId": pet.id, 
              "name": pet.name,
              "thumbnail": imagePath ? (this.backendURL + imagePath) : null,
              "comment": pet.comment,
              "breed": pet.breed.name,
              "toAdd": !this.data.petMemberIds.includes(pet.id)
            })
        })
      } else {
        this.messageAboutHuman = "Human without associated pets";
      }
    } else {
      this.messageAboutHuman = "There is no human associated with this email account";
    }
  }
  getShortenedComment(comment: string, maxLength: number): string {
    return this._utilsServices.getShortenedComment(comment,maxLength);
  }

  async AddPetToCommnity(pet: any){
    const communityId = this.data.communityId;
    const data: any =  {"operation": "insert", "petId": pet.petId};
    const added = await this.communitiesService.updatePetMember(communityId, data);
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
