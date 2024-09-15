import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { environment } from '../../../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { PetProfileComponent } from '../pet-profile/pet-profile.component';

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
  imageUrl? : string; 
  backendURL = environment.backendPetZocialURL;

  
  constructor(
    public dialog: MatDialog
  ) {}

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

  gotoProfile(){
    const dialogRef = this.dialog.open(PetProfileComponent, {
      width: '600px', 
      height: '700px',
      data: this.pet, 
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Modal cerrado:', result);
    });
  }
}
