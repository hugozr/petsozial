import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PetsComponent } from './pets/pets.component';
import { PetComponent } from './pets/pet/pet.component';

const routes: Routes = [
  {path: "", component: PetsComponent},
  {path: "pet", component: PetComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterRoutingModule { }
