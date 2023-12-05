import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VeterinariesComponent } from './veterinaries/veterinaries.component';
import { VeterinaryComponent } from './veterinaries/veterinary/veterinary.component';

const routes: Routes = [
  {path: "", component: VeterinariesComponent},
  {path: "veterinary", component: VeterinaryComponent},
  {path: "veterinary/:id", component: VeterinaryComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PetHealthRoutingModule { }
