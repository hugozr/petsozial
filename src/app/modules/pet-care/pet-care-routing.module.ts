import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PetShopsComponent } from './pet-shops/pet-shops.component';
import { PetShopComponent } from './pet-shops/pet-shop/pet-shop.component';
import { PetShop01Component } from './pet-shops/pet-shop-01/pet-shop-01.component';

const routes: Routes = [
  {path: "", component: PetShopsComponent},
  {path: "pet-shop", component: PetShopComponent},
  {path: "pet-shop/:id", component: PetShopComponent},
  {path: "pet-shop-01/:id", component: PetShop01Component},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PetCareRoutingModule { }
