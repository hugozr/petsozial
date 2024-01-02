import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PetsComponent } from './pets/pets.component';
import { PetComponent } from './pets/pet/pet.component';
import { HumansComponent } from './humans/humans.component';
import { HumanComponent } from './humans/human/human.component';
import { Human01Component } from './humans/human-01/human-01.component';

const routes: Routes = [
  {path: "", component: PetsComponent},
  {path: "pet", component: PetComponent},
  {path: "humans", component: HumansComponent},
  {path: "human", component: HumanComponent},
  {path: "human/:id", component: HumanComponent},
  {path: "human-01/:id", component: Human01Component},
  {path: "pet/:id", component: PetComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterRoutingModule { }
