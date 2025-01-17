import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from '../../../../services/utils.service';
import { environment } from '../../../../../environments/environment';
import { Community } from '../../../../interfaces/community';
import { CommunitiesService } from '../../../../services/communities.service';
import { AuthService } from '../../../../services/auth.service';
import { UsersService } from '../../../../services/users.service';
import { ZonesService } from '../../../../services/zones.service';
import { AppointmentsService } from '../../../../services/appointments.service';

@Component({
  selector: 'app-community',
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
  templateUrl: './appointment.component.html',
  styleUrl: './appointment.component.css'
})
export class AppointmentComponent {
  @ViewChild('fileInput') fileInput: any;
  rowspan = 11;
  myForm!: FormGroup;
  appointmentToEdit!: any;
  insert = true;
  user: any = null;   

  backendURL = environment.backendPetZocialHealthURL;
  loadMyPicture = "/assets/load-appointment-picture.png";
  petId: any = null;
  constructor(
    private appointmentsService: AppointmentsService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private _utilsService: UtilsService,
    private _authService: AuthService,
    private usersService: UsersService,
  ) {
    this.myForm = this.formBuilder.group({
      description: [""],
      image: [this.loadMyPicture]
    });
  }

  async ngAfterViewInit(){
    //HZUMAETA Traigo al usuario para que el Id lo matricule como creador de la comunidad
    const email = this._authService.getUserEmail();
    const userKc: any = await this.usersService.getUsersByEmail(email);
    if (userKc.docs.length > 0 ) this.user = userKc.docs[0]; 
  }

  async ngOnInit(): Promise<void> {

    // if(!this._authService.isLoggedIn()){
    //   this._utilsService.showMessage("You must have authenticated.");
    //   this.router.navigate(['/pet-health/appointments']);
    //   return;
    // }
    this.route.queryParams.subscribe(async (params: any) => {
      this.petId = params.petId;
    });

    this.route.params.subscribe(async (params: any) => {
      if (params.id) {
        this.insert = false;
        this.appointmentToEdit = await this.appointmentsService.getAppointment(params.id);
        const imagePath = this.appointmentToEdit?.appointmentImage?.url;

        this.myForm.setValue({
          description: this.appointmentToEdit.description,
          image: imagePath ? (this.backendURL + imagePath) : this.loadMyPicture
        });
      }
    });
  }

  async saveAppointment() {
    const appointment: any = {
      "petId": this.petId,
      "description": this.myForm.value.description,
    };
    const communityResult: any = this.insert ? await this.appointmentsService.insertAppointment(appointment) : await this.appointmentsService.updateAppointment(this.appointmentToEdit.id, appointment);
    if (communityResult) {
      this._utilsService.showMessage("Community's data was successfully updated", 2000, true);
      if (this.insert) {
        //La comunidad se le asigna al usuario que la ha creado, ya que UN USUARIO PUEDE ADMINISTRAR VARIAS COMUNIDADES
        // const user = await this.usersService.updateCommunity(this.user.id, {"operation": "insert", "communityId": communityResult.doc.id});
        this.router.navigate(["/pet-health/appointments/", this.petId]);
      }
    }
  }
  loadImage() {
    this.fileInput.nativeElement.click();
  }

  changeImage(event: Event) {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];
    if (archivo) {
      const lector = new FileReader();
      lector.onload = async () => {
        if (!this.insert) {
          const media: any = { file: archivo, alt: this.appointmentToEdit.description, objId: this.appointmentToEdit.id }
          const uploadedFile: any = await this._utilsService.uploadHealthFile(media);
          const updatedAppointment = await this.appointmentsService.patchAppointment(this.appointmentToEdit.id, { "appointmentImage": uploadedFile.doc.id });
          if (updatedAppointment) this._utilsService.showMessage("The appointment's image has been successfully updated", 2000, true);
        }
        this.myForm.patchValue({
          image: lector.result
        });
      };
      lector.readAsDataURL(archivo);
    }
  }
}


