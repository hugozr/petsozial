// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-vet-appointments',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './vet-appointments.component.html',
//   styleUrl: './vet-appointments.component.css'
// })
// export class VetAppointmentsComponent {

// }

// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-appointments',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './appointments.component.html',
//   styleUrl: './appointments.component.css'
// })
// export class AppointmentsComponent {

// }



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
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';

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

  constructor(
    private appointmentsService: AppointmentsService,
    private vetsService: VetsService,
    private _authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private _utilsService: UtilsService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.userName = this._authService.getUserName();  //HZUMAETA Solo puede crear comunidades un usuario logeado
    
    // this.route.queryParams.subscribe(async (params: any) => {
    //   this.vetData = params;
    //   console.log(this.vetData, "ododododod")
    // });

    this.route.params.subscribe(async (params: any) => {
      if (params.id) {
        this.vetId = params.id;
        this.vetData = await this.vetsService.getVet(this.vetId);
        console.log(this.vetData, "aca")
        this.loadAppointments(this.vetId, this.pageSize, 0);
      }
    });
  }

  async loadAppointments(vetId:string, pageSize: number, page: number) {
    const data: any = await this.appointmentsService.filterAppointments('vetId', vetId, pageSize, page);
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
        humanName: elem.jsonData?.human?.name || "",
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
    this.loadAppointments(this.vetId, event.pageSize, event.pageIndex + 1);
  }

  onRowClick(row: any) {
    console.log(row); // prints the data for the clicked row
  }

  edit(element: any) {
    console.log(element, "que hay")
    this.router.navigate(['/pet-health/appointment/', element.id]);
  }


  addAppointment() {
    this.router.navigate(['/pet-health/appointment'], { queryParams: { petId: this.vetId } });
  }
  
  async delete(element: any) {
      const deleted = await lastValueFrom(this.appointmentsService.deleteAppointment(element.id));
      if (deleted) {
        this.loadAppointments(this.vetId, this.pageSize, 0);
        this._utilsService.showMessage("Appointment record successfully deleted",2000,true);
      }
  }

}
