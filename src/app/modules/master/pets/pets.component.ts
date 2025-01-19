import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { PetsService } from '../../../services/pets.service';
import { lastValueFrom, Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { UtilsService } from '../../../services/utils.service';
import { environment } from '../../../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { HumansByPetsComponent } from '../humans/humans-by-pets/humans-by-pets.component';
import { EventsService } from '../../../services/events.service';
import { ZonesService } from '../../../services/zones.service';
import { AppointmentsComponent } from '../../pet-health/appointments/appointments/appointments.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-pets',
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
    RouterModule
  ],
  templateUrl: './pets.component.html',
  styleUrl: './pets.component.css',
})
export class PetsComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'human',
    'comment',
    'specie',
    'breed',
    'gender',
    'birthday',
    'thumbnail',
    'actions',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('input', { static: true }) inputElement!: ElementRef;

  pets: any[] = [];
  dataSource = new MatTableDataSource(this.pets);
  backendURL = environment.backendPetZocialURL;

  pageSize: number = 10;
  totalRows: number = 0;
  pageSizeOptions: number[] = [10, 50, 100];
  timeoutId!: any;

  selectedZone: string = "";
  private eventSubscription?: Subscription;

  constructor(
    private petsService: PetsService,
    private _utilsService: UtilsService,
    private eventsServices: EventsService,
    private zonesServices: ZonesService,
    private router: Router,    
    private _authService: AuthService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.selectedZone = this.zonesServices.getCurrentZone();
    this.loadPetsByZone(this.selectedZone, this.pageSize, 0, "");
    //Reacciona al cambio de zonas
    this.eventSubscription = this.eventsServices.event$.subscribe(data => {
      this.selectedZone = data;
      this.loadPetsByZone(this.selectedZone, this.pageSize, 0, "");
    });
  }

  async loadPets(pageSize: number, page: number, filter: string ) {
    const data: any = await this.petsService.getPets(pageSize, page, filter);
    this.fillPetTable(data);
  }

  async loadPetsByZone(zoneId: string, pageSize: number, page: number, filter: string ) {
    const data: any = await this.petsService.getPetsByZone(zoneId, pageSize, page, filter);
    this.fillPetTable(data);
  }

  fillPetTable(data: any){
    this.pets = [];
    data.docs.map((elem: any) => {
      const imagePath = elem.petImage?.sizes?.thumbnail?.url
      this.pets.push({
        id: elem.id,
        name: elem.name,
        human: elem.human.name,
        gender: elem.gender,
        specie: elem.specie.name,
        breed: elem.breed.name,
        birthday: elem.birthday,
        comment: elem.comment,
        thumbnail: imagePath ? (this.backendURL + imagePath) : null
      });
    });
    this.dataSource = new MatTableDataSource(this.pets);
    this.dataSource.sort = this.sort;

    this.totalRows = data.totalDocs;
    this.pageSize = data.limit;
  }

  pageChanged(event: PageEvent) {
    this.loadPets(event.pageSize, event.pageIndex + 1,"");
  }

  applyFilter(event: Event) {
    //HZUMAETA Espera medio segundo para enviar el filtro
    const filterValue = (event.target as HTMLInputElement).value;
    const miliSecondsToWait = 500;
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
        this.filter(filterValue);
    }, miliSecondsToWait);
 }

  async filter(filter: string) {
    const data: any = await this.petsService.filterPetsByZone(this.selectedZone, this.pageSize, 0, filter);
    this.fillPetTable(data);
  }

  async delete(element: any) {
    const canDelete: any = await lastValueFrom(this.petsService.canDeletePet(element.id));
    if (canDelete.canDelete) {
      // console.log(canDelete, "aaa")
      const deleted = await lastValueFrom(this.petsService.deletePet(element.id));
      if (deleted) {
        const filter = this.inputElement.nativeElement.value;
        this.loadPetsByZone(this.selectedZone, this.pageSize, 0, filter);
        this._utilsService.showMessage("Pet record successfully deleted",2000,true);
      }
    } else {
      this._utilsService.showMessage("You cannot delete this oet: " + canDelete.message, 2000, true);
    }
  }

  edit(element: any) {
    this.router.navigate(['/master/pet/', element.id]);
  }

  otraAccion() {
    // Lógica para otra acción
    console.log('Otra Acción');
  }


  
  showHumans(pet: any){
    const dialogRef = this.dialog.open(HumansByPetsComponent, {
      width: '950px',
      height: "600px",
      data: {pet},
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if(result) {
        // this.loadPets(this.pageSize, 0, "", this.communityId);
      }
    });
  }
  showAppointments(pet: any){
    if(!this._authService.isLoggedIn()){
      this._utilsService.showMessage("You must have authenticated.");
      // this.router.navigate(['/pet-health']);
      return;
    }
    this.router.navigate(['/pet-health/appointments/', pet.id], { queryParams: pet });
  }

  downloadFile(){
    this.petsService.downloadFile("pets.xlsx");
  }
}
