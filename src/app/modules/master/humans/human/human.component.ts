import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators  } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from '../../../../services/utils.service';
import { environment } from '../../../../../environments/environment';
import { HumansService } from '../../../../services/humans.service';
import { Human } from '../../../../interfaces/human';

@Component({
  selector: 'app-human',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatCardModule,
    MatGridListModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './human.component.html',
  styleUrl: './human.component.css'
})
export class HumanComponent {
  @ViewChild('fileInput') fileInput: any;
  rowspan = 9;
  form!: FormGroup;
  humanToEdit!: Human;
  insert = true;
  backendURL = environment.backendPetZocialURL;
  loadMyPicture = "/assets/load-my-human-picture.png";

  constructor(
    private humansService: HumansService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private _utilsService: UtilsService,
    
  ) { 
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nickName: ["", Validators.required],
      name: ["", Validators.required],
      comment: [""],
      address: ["", Validators.required],
      phone: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      image: [this.loadMyPicture]
    });
    this.route.params.subscribe(async (params: any) => {
      if(params.id){
        this.insert = false;
        this.humanToEdit = await this.humansService.getHuman(params.id);
        const imagePath = this.humanToEdit?.humanImage?.url;

        this.form.setValue({
          nickName: this.humanToEdit.nickName,
          name: this.humanToEdit.name,
          comment: this.humanToEdit.comment,
          phone: this.humanToEdit.phone,
          email: this.humanToEdit.email,
          address: this.humanToEdit.address || "",
          image: imagePath ?  (this.backendURL + imagePath) : this.loadMyPicture
        });
      }
    });
  }
  async saveHuman() {
    const human: Human = {
      "nickName": this.form.value.nickName,
      "name": this.form.value.name,
      "comment": this.form.value.comment,
      "address": this.form.value.address,
      "phone": this.form.value.phone,
      "email": this.form.value.email,
    }
    const humanResult = this.insert ? await this.humansService.insertHuman(human) : await this.humansService.updateHuman(this.humanToEdit.id, human);
    if (humanResult){
      this._utilsService.showMessage("Human's data was successfully updated",2000,true);
      if(this.insert){
        this.router.navigate(["/master/humans"]);
      }
    }
  }
  loadImage() {
    this.fileInput.nativeElement.click();
  }
  changeImage(event: Event) {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];
    console.log(archivo);
    if (archivo) {
      const lector = new FileReader();
      lector.onload = async () => {
        if(!this.insert){
          const media: any  = {file: archivo, alt: this.humanToEdit.name, objId:this.humanToEdit.id }
          const uploadedFile: any = await this._utilsService.uploadFile(media);
          const updatedPet = await this.humansService.patchHuman(this.humanToEdit.id,{"humanImage": uploadedFile.doc.id});
          if(updatedPet) this._utilsService.showMessage("The human's image has been successfully updated");
        } 
        this.form.patchValue({
          image: lector.result
        });
      };
      lector.readAsDataURL(archivo);
    }
  }
  
}



