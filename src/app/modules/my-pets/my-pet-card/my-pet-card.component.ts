import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-my-pet-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule
  ],
  templateUrl: './my-pet-card.component.html',
  styleUrl: './my-pet-card.component.css'
})

export class MyPetCardComponent {
  @Input() pet: any | undefined;
  imageUrl? : string; // "assets/macallan.jpg";
  backendURL = environment.backendPetZocialURL;

  ngOnInit(): void {
    const imagePath = this.pet.petImage?.sizes?.tablet?.url;
    imagePath ? (this.backendURL + imagePath) : null;
    if(imagePath) 
    {
      this.imageUrl = this.backendURL + imagePath
    }
    else{
      this.imageUrl = "assets/macallan.jpg";
    };
  }
}
