import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { lastValueFrom } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { UtilsService } from '../../../services/utils.service';
import { VetsService } from '../../../services/vets.service';
import { environment } from '../../../../environments/environment';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HealthServicesComponent } from '../health-services/health-services.component';
import { VetServicesComponent } from '../vet-services/vet-services.component';
import { AuthService } from '../../../services/auth.service';
import { VetCommunitiesComponent } from './vet-communities/vet-communities.component';

@Component({
  selector: 'app-veterinaries',
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
  ],
  templateUrl: './veterinaries.component.html',
  styleUrl: './veterinaries.component.css',
})
export class VeterinariesComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'social',
    'comment',
    'phone',
    'address',
    'email',
    'thumbnail',
    'actions',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  vets: any[] = [];
  dataSource = new MatTableDataSource(this.vets);
  backendURL = environment.backendPetZocialURL;
  pageSize: number = 10;
  totalRows: number = 0;
  pageSizeOptions: number[] = [10, 50, 100];
  timeoutId!: any;
  userName!: string;

  constructor(
    private vetsService: VetsService,
    private _utilsService: UtilsService,
    private _authService: AuthService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.userName = this._authService.getUserName();
    this.loadVets(this.pageSize, 0);
  }

  async loadVets(pageSize: number, page: number) {
    const data: any = await this.vetsService.getVets(pageSize, page);
    this.fillVetTable(data);
  }

  fillVetTable(data: any) {
    this.vets = [];
    data.docs.map((elem: any) => {
      const imagePath = elem.vetImage?.sizes?.thumbnail?.url;
      this.vets.push({
        id: elem.id,
        name: elem.name,
        comment: elem.comment,
        email: elem.email,
        address: elem.address,
        phone: elem.phone,
        url: elem.url,
        thumbnail: imagePath ? this.backendURL + imagePath : null,
        canManageCOmmunities: elem.kcUserName == this.userName && this.userName != undefined
      });
      console.log(elem.kcUserName, this.userName, elem.name);
    });
    this.dataSource = new MatTableDataSource(this.vets);
    this.dataSource.sort = this.sort;
    this.totalRows = data.totalDocs;
    this.pageSize = data.limit;
  }

  pageChanged(event: PageEvent) {
    this.loadVets(event.pageSize, event.pageIndex + 1);
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
    const data: any = await this.vetsService.filterVets(
      this.pageSize,
      0,
      filter
    );
    this.fillVetTable(data);
  }

  async delete(element: any) {
    const deleted = await lastValueFrom(this.vetsService.deleteVet(element.id));
    this.loadVets(this.pageSize, 0);
    if (deleted) {
      this._utilsService.showMessage(
        'Vet record successfully deleted',
        2000,
        true
      );
    }
  }

  edit(element: any) {
    this.router.navigate(['/pet-health/veterinary/', element.id]);
  }

  async communities(element: any) {
    console.log(element, "Ver user", this.userName);
    const dialogRef = this.dialog.open(VetCommunitiesComponent, {
      width: '1200px',
      height: "500px",
      data: element,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Modal cerrado:', result);
    });
  }
  vetServices(element: any) {
    const dialogRef = this.dialog.open(VetServicesComponent, {
      width: '1200px', 
      height: '500px',
      data: element, 
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Modal cerrado:', result);
    });
  }

  goToLoation(element: any) {
    this.router.navigate(['/locations'], { queryParams: { vet: element.id } });
  }

  downloadFile() {
    this.vetsService.downloadFile('veterinaries.xlsx');
  }

  addVet() {
    if (this.userName) {
      this.router.navigate(['/pet-health/veterinary']);
    } else {
      if (confirm('You need to be logged in. Will you log in?')) {
        this._authService.login();
      }
    }
  }
}
