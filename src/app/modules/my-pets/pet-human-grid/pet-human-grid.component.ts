
import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-pet-human-grid',
  standalone: true,
  imports: [
    MatCardModule,
    MatDialogModule 
  ],
    templateUrl: './pet-human-grid.component.html',
    styleUrl: './pet-human-grid.component.css'
})
export class PetHumanGridComponent {
  @Input() petHumans: any;
  backendURL = environment.backendPetZocialURL;

  constructor(
  ) {}

  async ngOnInit() {
    console.log(this.petHumans, "sss")
    this.petHumans.forEach((item: any) => {
      item.humanImageUrl = `${this.backendURL}${item.humanImageUrl}`;
    });
  }

  // async setUrlToImage(){
    
  // }

  onCardClick(card: any): void {
    console.log("salta a ver los datos del usuario");
  }
}
