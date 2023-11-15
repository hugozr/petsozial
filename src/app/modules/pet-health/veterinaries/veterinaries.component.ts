import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-veterinaries',
  standalone: true,
  imports: [CommonModule,MatToolbarModule],
  templateUrl: './veterinaries.component.html',
  styleUrl: './veterinaries.component.css'
})
export class VeterinariesComponent {

}
