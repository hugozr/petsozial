import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyPetsComponent } from './my-pets/my-pets.component';

const routes: Routes = [
  {path: "", component: MyPetsComponent,  data: { scope: "favorite"}},
  {path: "all", component: MyPetsComponent, data: { rqUserLoggedIn: false, scope: "all"} },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyPetsRoutingModule { }
