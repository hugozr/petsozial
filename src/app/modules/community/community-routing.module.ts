import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommunitiesComponent } from './communities/communities.component';
import { CommunityComponent } from './communities/community/community.component';
import { PetMembersComponent } from './communities/pet-members/pet-members.component';

const routes: Routes = [
  {path: "", component: CommunitiesComponent},
  {path: "community", component: CommunityComponent},
  {path: "community/:id", component: CommunityComponent},
  {path: "pet-members/:id", component: PetMembersComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommunityRoutingModule { }
