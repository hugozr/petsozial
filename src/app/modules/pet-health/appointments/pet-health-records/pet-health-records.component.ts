import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from '../../../../services/utils.service';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../../services/auth.service';
import { UsersService } from '../../../../services/users.service';
import { ZonesService } from '../../../../services/zones.service';
import { AppointmentsService } from '../../../../services/appointments.service';
import { VetsService } from '../../../../services/vets.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { VetCommunitiesService } from '../../../../services/vetCommunities.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PetsService } from '../../../../services/pets.service';

@Component({
  selector: 'app-pet-health-records',
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
    MatDatepickerModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatCheckboxModule,
  ],
  templateUrl: './pet-health-records.component.html',
  styleUrl: './pet-health-records.component.css'
})
export class PetHealthRecordsComponent {
  @ViewChild('fileInput') fileInput: any;
  rowspan = 11;
  myForm!: FormGroup;
  appointment!: any;
  petHealthRecord!: any;
  insert = false;
  user: any = null;
  vetServices: any = null;   
  backendURL = environment.backendPetZocialHealthURL;
  loadMyPicture = "/assets/load-appointment-picture.png";
  pet: any = null;

  constructor(
    private appointmentsService: AppointmentsService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private _utilsService: UtilsService,
    private _authService: AuthService,
    private usersService: UsersService,
    private vetsService: VetsService,
  ) {
    this.myForm = this.formBuilder.group({
      services: [],
      diagnosis: [""],
      treatment: [""],
      medications: [""],    
      image: [this.loadMyPicture],
      checkUpDate: [this._utilsService.getToday()],
    });
  }

  async ngAfterViewInit(){
    const email = this._authService.getUserEmail();
    const userKc: any = await this.usersService.getUsersByEmail(email);
    if (userKc.docs.length > 0 ) this.user = userKc.docs[0]; 
  }

  async ngOnInit(): Promise<void> {
    this.route.queryParams.subscribe(async (params: any) => {
      this.appointment = await this.appointmentsService.getAppointment(params.appointmentId);
      this.petHealthRecord = await this.appointmentsService.getPetHealthRecords(params.appointmentId);
      this.vetServices =  await this.vetsService.getVetServices(this.appointment.vetId);
      console.log(this.vetServices, "a")
      // console.log(this.appointment, this.petHealthRecord, "daaaaaaaaaae")
      if (this.petHealthRecord){
        const imagePath = this.petHealthRecord?.checkUpImage?.url;
        console.log(this.petHealthRecord, "ia")
        this.myForm.setValue({

          services: this.petHealthRecord.services,
          diagnosis: this.petHealthRecord.diagnosis,
          treatment: this.petHealthRecord.treatment,
          medications: this.petHealthRecord.medications,    
          image: imagePath ? (this.backendURL + imagePath) : this.loadMyPicture,
          checkUpDate: this.petHealthRecord.checkUpDate,

        });
      } else {
        this.insert = true;
      }
    });
    // this.route.params.subscribe(async (params: any) => {
    //   if (params.id) {
    //     this.insert = false;
    //     this.appointmentToEdit = await this.appointmentsService.getAppointment(params.id);

    //     const imagePath = this.appointmentToEdit?.appointmentImage?.url;

    //     this.myForm.setValue({
    //       description: this.appointmentToEdit.description,
    //       appointmentDate: this.appointmentToEdit.appointmentDate,
    //       vet: this.appointmentToEdit.vetId,
    //       human: this.appointmentToEdit.humanId,
    //       comeHome: this.appointmentToEdit.comeHome,
    //       contactMe: this.appointmentToEdit.contactMe,
    //       image: imagePath ? (this.backendURL + imagePath) : this.loadMyPicture
    //     });
    //   }
    // });
  }

  async savePetHealthRecord() {
    const record: any = {
      petId:this.appointment.petId,
      petHumanId: this.appointment.petHumanId,
      appointmentId: this.appointment.id,
      diagnosis: this.myForm.value.diagnosis,
      treatment: this.myForm.value.treatment,
      medications: this.myForm.value.medications,
      checkUpDate: this.myForm.value.checkUpDate,
    }
    const appointmentResult: any = this.insert ? await this.appointmentsService.insertPetHealthRecord(record) : await this.appointmentsService.updatePetHealthRecord(this.petHealthRecord.id, record);
    if (appointmentResult) {
      this._utilsService.showMessage("Record's data was successfully updated", 2000, true);
      this.router.navigate(["/pet-health/my-appointments/"]);
      // if (this.insert) {
      // }
    }
  }

  loadImage() {
    this.fileInput.nativeElement.click();
  }

  changeImage(event: Event) {
    // const input = event.target as HTMLInputElement;
    // const archivo = input.files?.[0];
    // if (archivo) {
    //   const lector = new FileReader();
    //   lector.onload = async () => {
    //     if (!this.insert) {
    //       const media: any = { file: archivo, alt: this.appointmentToEdit.description, objId: this.appointmentToEdit.id }
    //       const uploadedFile: any = await this._utilsService.uploadHealthFile(media);
    //       const updatedAppointment = await this.appointmentsService.patchAppointment(this.appointmentToEdit.id, { "appointmentImage": uploadedFile.doc.id });
    //       if (updatedAppointment) this._utilsService.showMessage("The appointment's image has been successfully updated", 2000, true);
    //     }
    //     this.myForm.patchValue({
    //       image: lector.result
    //     });
    //   };
    //   lector.readAsDataURL(archivo);
    // }
  }
  
}
