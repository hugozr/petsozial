import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PetCareServicesComponent } from './pet-care-services/pet-care-services.component';

const routes: Routes = [
  {path: "", component: PetCareServicesComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PetCareRoutingModule { }
