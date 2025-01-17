import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VeterinariesComponent } from './veterinaries/veterinaries.component';
import { VeterinaryComponent } from './veterinaries/veterinary/veterinary.component';
import { Veterinary01Component } from './veterinaries/veterinary-01/veterinary-01.component';
import { AppointmentsComponent } from './appointments/appointments/appointments.component';
import { AppointmentComponent } from './appointments/appointment/appointment.component';

const routes: Routes = [
  {path: "", component: VeterinariesComponent},
  {path: "veterinary", component: VeterinaryComponent},
  {path: "veterinary/:id", component: VeterinaryComponent},
  {path: "appointments/:id", component: AppointmentsComponent},
  {path: "appointment", component: AppointmentComponent},
  {path: "appointment/:id", component: AppointmentComponent},
  {path: "veterinary-01/:id", component: Veterinary01Component},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PetHealthRoutingModule { }
