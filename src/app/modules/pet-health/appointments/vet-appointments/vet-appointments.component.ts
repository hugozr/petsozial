

import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { lastValueFrom, Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { environment } from '../../../../../environments/environment';
import { AppointmentsService } from '../../../../services/appointments.service';
import { AuthService } from '../../../../services/auth.service';
import { PetHeaderComponent } from "../../../../navigation/data-headers/pet-header/pet-header.component";
import { UtilsService } from '../../../../services/utils.service';
import { VetsService } from '../../../../services/vets.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AbstractControl, FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';  // 👈 Importar aquí
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-vet-appointments',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule,
    RouterModule,
    MatDialogModule,
    PetHeaderComponent,
    FormsModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatDatepickerModule
],
  templateUrl: './vet-appointments.component.html',
  styleUrl: './vet-appointments.component.css'
})
export class VetAppointmentsComponent implements OnInit {
  displayedColumns: string[] = [
    'pet',
    'date',
    'description',
    'human',
    'contactMe',
    'comeHome',
    'status',
    'actions',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  appointments: any[] = [];
  dataSource = new MatTableDataSource(this.appointments);
  backendURL = environment.backendPetZocialURL;
  vetId: any;
  vetData: any;

  pageSize: number = 10;
  totalRows: number = 0;
  pageSizeOptions: number[] = [10, 50, 100];
  timeoutId!: any;
  userName = null;
  selectedZone: string = "";

  startDate: Date = new Date();
  endDate: Date = new Date();

  dateRangeForm!: FormGroup;

  constructor(
    private appointmentsService: AppointmentsService,
    private vetsService: VetsService,
    private router: Router,
    private route: ActivatedRoute,
    private _authService: AuthService,
    private _utilsService: UtilsService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder
  ) {
    const dateRange = this._utilsService.getDateRangeFromLocalStorage();
    const validDateRange = this._utilsService.getValidDateRange(dateRange);
    this.dateRangeForm = this.formBuilder.group({
      startDate: [validDateRange.startDate],  // ⏳ Inicializa con la fecha actual
      endDate: [validDateRange.endDate]  // ⏳ Inicializa con la fecha actual
    },
    { validators: this.dateRangeValidator } // Aplicar validador personalizado
    );
   }

   dateRangeValidator(group: AbstractControl) {
    const start = group.get('startDate')?.value;
    const end = group.get('endDate')?.value;

    if (start && end && start > end) {
      return { dateRangeInvalid: true }; // Error si startDate es mayor que endDate
    }
    return null; // Válido
  }

  // Método para verificar si hay error en la validación
  isDateRangeInvalid(): boolean {
    return this.dateRangeForm.hasError('dateRangeInvalid');
  }

  ngOnInit(): void {
    this.userName = null; // this._authService.getUserName();  //HZUMAETA Solo puede crear comunidades un usuario logeado

    this.route.params.subscribe(async (params: any) => {
      if (params.id) {
        this.vetId = params.id;
        this.vetData = await this.vetsService.getVet(this.vetId);
        this.loadAppointments(this.vetId, this.pageSize, 0, this.dateRange());
      }
    });

    this.dateRangeForm.valueChanges.subscribe(value => {
      if (value.startDate && value.endDate) {
        this.fetchData(value.startDate, value.endDate);
      }
    });
    this.fetchData(this.dateRangeForm.value.startDate, this.dateRangeForm.value.endDate);
  }

  fetchData(start: Date, end: Date) {
    console.log('Obteniendo datos desde:', start, 'hasta:', end);
    this.loadAppointments(this.vetId, this.pageSize, 0, this.dateRange());
    // Aquí puedes hacer una petición HTTP para traer los datos dentro del rango de fechas
  }

  async loadAppointments(vetId:string, pageSize: number, page: number, dateRange: any) {
    const data: any = await this.appointmentsService.filterAppointments('vetId', vetId, pageSize, page, dateRange);
    console.log(data, "ver contact me")
    this.fillAppointmentTable(data);
  }

  fillAppointmentTable(data: any) {
    this.appointments = [];
    data.docs.map((elem: any) => {
      this.appointments.push({
        id: elem.id,
        description: elem.description,
        appointmentDate: elem.appointmentDate,
        petName: elem.jsonData?.pet?.name || "",
        humanName: elem.jsonData?.petHuman?.name || "",
        status: elem.status,
        contactMe: elem.contactMe,
        comeHome: elem.comeHome,
      });
    });
    this.dataSource = new MatTableDataSource(this.appointments);
    this.dataSource.sort = this.sort;
    this.totalRows = data.totalDocs;
    this.pageSize = data.limit;
  }

  pageChanged(event: PageEvent) {
    this.loadAppointments(this.vetId, event.pageSize, event.pageIndex + 1, this.dateRange());
  }

  onRowClick(row: any) {
    console.log(row); // prints the data for the clicked row
  }

  edit(element: any) {
    this.router.navigate(['/pet-health/vet-appointment/', element.id], { queryParams: { vetId: this.vetId } });
  }

  addVetAppointment() {
    this.router.navigate(['/pet-health/vet-appointment'], { queryParams: { vetId: this.vetId } });
  }
  
  async delete(element: any) {
      const deleted = await lastValueFrom(this.appointmentsService.deleteAppointment(element.id));
      if (deleted) {
        this.loadAppointments(this.vetId, this.pageSize, 0, this.dateRange());
        this._utilsService.showMessage("Appointment record successfully deleted",2000,true);
      }
  }

  dateRange(){
    this._utilsService.setDateRangeInLocalStorage(this.dateRangeForm.value.startDate,this.dateRangeForm.value.endDate, 5);
    return {
      startDate: this.dateRangeForm.value.startDate,
      endDate:this.dateRangeForm.value.endDate
    }
  }
}
