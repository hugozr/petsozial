import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pet-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pet-header.component.html',
  styleUrl: './pet-header.component.css'
})
export class PetHeaderComponent {
    @Input() petData: any;
}
