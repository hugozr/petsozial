import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { lastValueFrom } from 'rxjs';
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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PetshopsService } from '../../../services/petshops.service';

@Component({
  selector: 'app-pet-shops',
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
    MatDialogModule
  ],
  templateUrl: './pet-shops.component.html',
  styleUrl: './pet-shops.component.css'
})
export class PetShopsComponent implements OnInit {
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

  petshops: any[] = [];
  dataSource = new MatTableDataSource(this.petshops);
  backendURL = environment.backendPetZocialURL;
  pageSize: number = 10;
  totalRows: number = 0;
  pageSizeOptions: number[] = [10, 50, 100];
  timeoutId!: any;

  constructor(
    private petshopsService: PetshopsService,
    private _utilsService: UtilsService,
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadVets(this.pageSize, 0);
  }

  async loadVets(pageSize: number, page: number) {
    const data: any = await this.petshopsService.getPetshops(pageSize, page);
    this.fillVetTable(data);
  }

  fillVetTable(data: any){
    this.petshops = [];
    data.docs.map((elem: any) => {
      const imagePath = elem.petshopImage?.sizes?.thumbnail?.url;
      this.petshops.push({
        id: elem.id,
        name: elem.name,
        comment: elem.comment,
        email: elem.email,
        address: elem.address,
        phone: elem.phone,
        url: elem.url,
        thumbnail: imagePath ? (this.backendURL + imagePath) : null
      });
    });
    console.log(this.petshops, data.docs)
    this.dataSource = new MatTableDataSource(this.petshops);
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
    const data: any = await this.petshopsService.filterPetshops(this.pageSize, 0, filter);
    this.fillVetTable(data);
  }

  async delete(element: any) {
    const deleted = await lastValueFrom(this.petshopsService.deletePetshop(element.id));
    this.loadVets(this.pageSize, 0); 
    if (deleted) {
      this._utilsService.showMessage("Petshop record successfully deleted",2000,true);
    }
  }

  getIconSocialNetwork(url: string){
    return this._utilsService.getSocialMediaFromUrl(url);
  }

  edit(element: any) {
    this.router.navigate(['/pet-care/pet-shop/', element.id]);
  }

  goToLoation(element: any){
    this.router.navigate(['/locations'], { queryParams: { petshop: element.id } });
  }
}
