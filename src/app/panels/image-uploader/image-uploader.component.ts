import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-image-uploader',
  standalone: true,
  imports: [
    MatCardModule
  ],
  templateUrl: './image-uploader.component.html',
  styleUrl: './image-uploader.component.css'
})
export class ImageUploaderComponent {
  @Input() imagePath: string | null = null;
  @Output() imageLoaded = new EventEmitter<string>();
  imageSrc: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  constructor(
    private _utilsService: UtilsService,
  ){}
  
  ngOnInit() {
    if (this.imagePath) {
      this.imageSrc = this.imagePath;
    }
  }

  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.loadImage(file);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const dropZone = event.target as HTMLElement;
    dropZone.classList.add('dragover');
  }

  onDragLeave(event: DragEvent) {
    const dropZone = event.target as HTMLElement;
    dropZone.classList.remove('dragover');
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const dropZone = event.target as HTMLElement;
    dropZone.classList.remove('dragover');

    const file = event.dataTransfer?.files?.[0];
    if (file) {
      this.selectedFile = file;
      this.loadImage(file);
    }
  }

  loadImage(file: File) {
    const reader = new FileReader();
    reader.onload = async () => {
      this.imageSrc = reader.result;

      // Emite un identificador cuando se carga la imagen
      // const imageId = 'image_' + new Date().getTime(); // Puedes personalizar este ID
      const imageId = await this.uploadImage();

      this.imageLoaded.emit(imageId);
    };
    reader.readAsDataURL(file);
  }

  async uploadImage() {
    if (this.selectedFile) {
      const media: any  = {file: this.selectedFile, alt: "HZ Object Name", objId: "HZ Object Id" }; //TODO: poner los valores correctos
      const uploadedFile: any = await this._utilsService.uploadFile(media);
      if(uploadedFile.doc.id){
        return uploadedFile.doc.id;
      }
      return null;
    }
  }
}
