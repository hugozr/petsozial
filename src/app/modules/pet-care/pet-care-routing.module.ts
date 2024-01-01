import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PetShopsComponent } from './pet-shops/pet-shops.component';
import { PetShopComponent } from './pet-shops/pet-shop/pet-shop.component';

const routes: Routes = [
  {path: "", component: PetShopsComponent},
  {path: "pet-shop", component: PetShopComponent},
  {path: "pet-shop/:id", component: PetShopComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PetCareRoutingModule { }
