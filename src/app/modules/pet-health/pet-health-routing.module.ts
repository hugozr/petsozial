import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VeterinariesComponent } from './veterinaries/veterinaries.component';

const routes: Routes = [
  {path: "", component: VeterinariesComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PetHealthRoutingModule { }
