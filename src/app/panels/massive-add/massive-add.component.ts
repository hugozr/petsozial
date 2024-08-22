import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { HumansService } from '../../services/humans.service';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-massive-add',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatIconModule,
],
  templateUrl: './massive-add.component.html',
  styleUrl: './massive-add.component.css'
})
export class MassiveAddComponent {
  @ViewChild('fileInput') fileInput: any;

  selectedFile: File | null = null;

  constructor(
    private _utilsService: UtilsService,
  ) { 
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  selectFile(): void {
    this.fileInput.nativeElement.click();
  }

  uploadExcelFile(): void {
    if (this.selectedFile) {
      const lector = new FileReader();
      lector.onload = async () => {
        try {
          const media: any = { file: this.selectedFile, name: "caja de texto", username: "por obtener" };
          const uploadedFile: any = await this._utilsService.uploadExcelFile(media);
          console.log(",,,", uploadedFile, "kssksk");
        } catch (error) {
          console.error("Error durante la carga del archivo:", error);
        }
      };
      lector.readAsDataURL(this.selectedFile); // Asegúrate de iniciar la carga del 
    }
  }
  
}
