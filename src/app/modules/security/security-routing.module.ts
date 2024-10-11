import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { UserComponent } from './users/user/user.component';
import { UserProfileComponent } from './users/user-profile/user-profile.component';

const routes: Routes = [
  {path: "", component: UsersComponent},
  {path: "user", component: UserComponent},
  {path: "profile", component: UserProfileComponent},
  {path: "user/:id", component: UserComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecurityRoutingModule { }
