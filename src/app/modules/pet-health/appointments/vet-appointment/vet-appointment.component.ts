// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-vet-appointment',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './vet-appointment.component.html',
//   styleUrl: './vet-appointment.component.css'
// })
// export class VetAppointmentComponent {

// }


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
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { HumansService } from '../../../../services/humans.service';

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
    MatDatepickerModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatCheckboxModule,
  ],
  templateUrl: './vet-appointment.component.html',
  styleUrl: './vet-appointment.component.css'
})
export class VetAppointmentComponent {
  @ViewChild('fileInput') fileInput: any;
  rowspan = 11;
  myForm!: FormGroup;
  appointmentToEdit!: any;
  insert = true;
  user: any = null;   
  selectedZone: string = "";

  pets: any = null;
  humans: any = null;
  vetId: any = null;
  humanId: any = null;
  // comeHome = false;
  // contactMe = false;
  backendURL = environment.backendPetZocialHealthURL;
  loadMyPicture = "/assets/load-appointment-picture.png";
  petId: any = null;
  vet: any = null;

  constructor(
    private appointmentsService: AppointmentsService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private _utilsService: UtilsService,
    private _authService: AuthService,
    private usersService: UsersService,
    private zonesServices: ZonesService,
    private humansService: HumansService,    
    private vetsServices: VetsService,
    private vetCommunitiesService: VetCommunitiesService,
    private petsServices: PetsService,
  ) {
    this.myForm = this.formBuilder.group({
      description: [""],
      email: [""],
      pet: [""],
      human: [""],
      contactMe: [false],
      comeHome: [false],
      image: [this.loadMyPicture],
      appointmentDate: [this._utilsService.getToday()],
    });

    this.myForm.get("email")?.valueChanges.pipe(
      debounceTime(500), // Espera 500ms después de que el usuario deje de escribir
      distinctUntilChanged(), // Evita consultas repetidas con el mismo valor
      switchMap(value => this.getPetsByEmail(value)) // Llama al servicio con el valor del input
    ).subscribe((data: any) => {
      this.pets = data;
    });
  }

  async getPetsByEmail(value: any) {
    const humans: any = await this.humansService.getHumansByEmail(value);
    if (humans.length == 0) return;
    const humanId = humans[0].id
    const pets: any = await this.petsServices.filterPetsByHumanIdAndZone(100, 0, "", humanId, this.selectedZone);
    console.log(pets);
    if (pets === null) {
      return [];
    }
    return pets;
  }

  async ngAfterViewInit(){
    //HZUMAETA Traigo al usuario para que el Id lo matricule como creador de la comunidad
    this.selectedZone = this.zonesServices.getCurrentZone();
    // const queryVets: any = await this.vetsServices.getVetsByZone(this.selectedZone,-1,0,"");
    // this.pets = queryVets.docs
    const email = this._authService.getUserEmail();
    const userKc: any = await this.usersService.getUsersByEmail(email);
    if (userKc.docs.length > 0 ) this.user = userKc.docs[0]; 
  }

    async ngOnInit(): Promise<void> {
    this.route.queryParams.subscribe(async (params: any) => {
      this.vetId = params.vetId;
      this.vet = await this.vetsServices.getVet(this.vetId);
      await this.loadPersons(this.vet.id);
    });
    this.route.params.subscribe(async (params: any) => {
      if (params.id) {
        this.insert = false;
        this.appointmentToEdit = await this.appointmentsService.getAppointment(params.id);

        const imagePath = this.appointmentToEdit?.appointmentImage?.url;

        this.myForm.setValue({
          description: this.appointmentToEdit.description,
          appointmentDate: this.appointmentToEdit.appointmentDate,
          // vet: this.appointmentToEdit.vetId,
          human: this.appointmentToEdit.humanId,
          comeHome: this.appointmentToEdit.comeHome,
          contactMe: this.appointmentToEdit.contactMe,
          image: imagePath ? (this.backendURL + imagePath) : this.loadMyPicture
        });
      }
    });
  }

  async saveAppointment() {
    // const vet: any = this.vets.find((vet: any) => vet.id === this.myForm.value.vet);
    const pet: any = this.pets.find((pet: any) => pet.id === this.myForm.value.pet);
    const human: any = this.humans.find((human: any) => human.id === this.myForm.value.human);

    const appointment: any = {
      vetId: this.vet.id,
      humanId: this.myForm.value.human,
      petId: this.petId,
      description: this.myForm.value.description,
      zoneId: this.selectedZone,
      comeHome: this.myForm.value.comeHome,
      contactMe: this.myForm.value.contactMe,
      appointmentDate: this.myForm.value.appointmentDate,
      jsonData: {
        vet: {name: this.vet.name},
        human: human ? {name: human.name, email: human.email, phone: human.phone, nickName: human.nickName} : null,
        pet: {name: pet.name, specie: pet.specie.name, breed: pet.breed.name, image: pet.petImage.url}
      }
    };
    const appointmentResult: any = this.insert ? await this.appointmentsService.insertAppointment(appointment) : await this.appointmentsService.updateAppointment(this.appointmentToEdit.id, appointment);
    if (appointmentResult) {
      this._utilsService.showMessage("Appointment's data was successfully updated", 2000, true);
      if (this.insert) {
        //La comunidad se le asigna al usuario que la ha creado, ya que UN USUARIO PUEDE ADMINISTRAR VARIAS COMUNIDADES
        // const user = await this.usersService.updateCommunity(this.user.id, {"operation": "insert", "communityId": communityResult.doc.id});
        this.router.navigate(["/pet-health/vet-appointments/", this.vetId]);
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
  async loadPersons(vetId: string){
    const selComms: any = await this.vetCommunitiesService.getVetCommunities(vetId);
    const communities = selComms.docs;
    const communityVetIds = communities.filter((item: any) => item.jsonData.forVets === true).map((item: any) => item.communityId); // Extrae solo los communityId
    this.humans = await this.vetCommunitiesService.getHumansForVets(communityVetIds);
  }

}
