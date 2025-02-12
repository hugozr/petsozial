import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VetsService } from '../../../../services/vets.service';
import { CommunitiesService } from '../../../../services/communities.service';
import { VetCommunitiesService } from '../../../../services/vetCommunities.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-vet-communities',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatCardModule

  ],
  templateUrl: './vet-communities.component.html',
  styleUrl: './vet-communities.component.css'
})
export class VetCommunitiesComponent {
  
  allMyComms: any = [];
  selectedCommunities: any = [];
  availableCommunities: any = [];

  constructor(
    private _authService: AuthService,
    private communitiesService: CommunitiesService,
    private vetCommunitiesService: VetCommunitiesService,
    @Inject(MAT_DIALOG_DATA) public vetData: any
  ) {
  }

  async ngOnInit() {
    const allCommunitiesByUsername: any = await this.communitiesService.getCommunitiesByUsername(this._authService.getUserName());
    const selComms: any = await this.vetCommunitiesService.getVetCommunities(this.vetData.id);
    this.allMyComms = allCommunitiesByUsername.docs;
    this.selectedCommunities = selComms.docs;
    this.availableCommunities =  this.allMyComms.filter((coms: any) => !this.selectedCommunities.map((s:any) => s.communityId).includes(coms.id));
  }

  async addOption(community: any) {
    console.log(community, "uuuauau")
    const body: any = {
      vetId: this.vetData.id,
      communityId: community.id,
      username: this._authService.getUserName(),
      jsonData: {
        communityName: community.name,
        forVets: community.type.forVets,
        modality: community.modality,
        address: community.address,
      }
    }
    const addedVetCommunity =  await this.vetCommunitiesService.setVetCommunities(body);
    if(addedVetCommunity.doc){
      this.availableCommunities = this.availableCommunities.filter( (com: any) => com.id !== community.id);
      this.selectedCommunities.push(addedVetCommunity.doc);
    }
  }

  async removeOption(option: string) {
    const unset =  await this.vetCommunitiesService.unsetVetCommunities(option);
    if(unset){
      this.selectedCommunities = this.selectedCommunities.filter((sel: any) => sel.communityId !== unset.communityId);
      const community = this.allMyComms.find((hs: any) => hs.id === unset.communityId);
      this.availableCommunities.push(community);
    }
  }
}
