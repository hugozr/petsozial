import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { HumansService } from '../../services/humans.service';
import { UtilsService } from '../../services/utils.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { environment } from '../../../environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
    FormsModule,
    ReactiveFormsModule,
    
],
  templateUrl: './massive-add.component.html',
  styleUrl: './massive-add.component.css'
})
export class MassiveAddComponent {
  @ViewChild('fileInput') fileInput: any;
  title = "";
  templateFile = "";
  someDescription = "";

  selectedFile: File | null = null;

  constructor(
    private _utilsService: UtilsService,
    @Inject(MAT_DIALOG_DATA) public uploadData: any,
    private dialogRef: MatDialogRef<MassiveAddComponent>,

  ) { 
  }

  ngOnInit(): void {
    console.log(this.uploadData);   //HZUMAETA: Le paso el tipo de datos que está cargando 
    if(this.uploadData.typeFile == "humans") {
      this.title = "Upload humans from Excel file";
      this.templateFile = environment.folderTemplate + environment.humansTemplate;
    }

    if(this.uploadData.typeFile == "vets") {
      this.title = "Upload vets from Excel file";
      this.templateFile = environment.folderTemplate + environment.vetsTemplate;
    }
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  selectFile(): void {
    this.fileInput.nativeElement.click();
  }

  uploadExcelFile(): any {
    if (this.selectedFile) {
      const lector = new FileReader();
      lector.onload = async () => {
        try {
          const media: any = { 
            file: this.selectedFile, 
            name: this.someDescription,
            collection: this.uploadData.typeFile,
            username: "hzumaeta" };
          this._utilsService.showMessage("Success! File was uploaded.");
          const uploadedFile: any = await this._utilsService.uploadExcelFile(media);
          this.dialogRef.close();
          return uploadedFile;
        } catch (error) {
          console.error("Error durante la carga del archivo:", error);
          return error;
        }
      };
      lector.readAsDataURL(this.selectedFile); // Asegúrate de iniciar la carga del 
    }
  }
  
}
