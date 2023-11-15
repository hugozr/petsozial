import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-pet-care-services',
  standalone: true,
  imports: [CommonModule, MatToolbarModule],
  templateUrl: './pet-care-services.component.html',
  styleUrl: './pet-care-services.component.css'
})
export class PetCareServicesComponent {

}
