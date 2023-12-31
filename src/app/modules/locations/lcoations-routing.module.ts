import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StreetsComponent } from './streets/streets.component';

const routes: Routes = [
  {path: "", component: StreetsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocationsRoutingModule { }
