import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { UtilsService } from '../../../services/utils.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-veterinaries',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
  ],
  templateUrl: './veterinaries.component.html',
  styleUrl: './veterinaries.component.css'
})
export class VeterinariesComponent {
  constructor(private _utilsService: UtilsService) { }

  onFileChange(event: any) {
    const file = event.target.files[0];

    if (file) {
      const media: any = {
        file,
        alt: "alt",
        objId: "id"
      }
      this._utilsService.uploadFile(media);
    }
  }
}

