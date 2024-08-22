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
import { HumansService } from '../../../services/humans.service';
import { MassiveAddComponent } from '../../../panels/massive-add/massive-add.component';

@Component({
  selector: 'app-humans',
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
  templateUrl: './humans.component.html',
  styleUrl: './humans.component.css'
})
export class HumansComponent implements OnInit {
  displayedColumns: string[] = [
    'nickName',
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

  humans: any[] = [];
  dataSource = new MatTableDataSource(this.humans);
  backendURL = environment.backendPetZocialURL;

  pageSize: number = 10;
  totalRows: number = 0;
  pageSizeOptions: number[] = [10, 50, 100];
  timeoutId!: any;

  constructor(
    private humansService: HumansService,
    private _utilsService: UtilsService,
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadHumans(this.pageSize, 0);
  }

  async loadHumans(pageSize: number, page: number ) {
    const data: any = await this.humansService.getHumans(pageSize, page);
    this.fillHumanTable(data);
  }

  fillHumanTable(data: any){
    this.humans = [];
    data.docs.map((elem: any) => {     
      const imagePath = elem.humanImage?.sizes?.thumbnail?.url;
      this.humans.push({
        id: elem.id,
        nickName: elem.nickName,
        name: elem.name,
        comment: elem.comment,
        email: elem.email,
        address: elem.address,
        phone: elem.phone,
        socialUrl: elem.socialUrl,
        thumbnail: imagePath ? (this.backendURL + imagePath) : null
      });
    });
    this.dataSource = new MatTableDataSource(this.humans);
    this.dataSource.sort = this.sort;
    this.totalRows = data.totalDocs;
    this.pageSize = data.limit;
  }
  
  pageChanged(event: PageEvent) {
    console.log({ event });
    this.loadHumans(event.pageSize, event.pageIndex + 1);
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
    const data: any = await this.humansService.filterHumans(this.pageSize, 0, filter);
    this.fillHumanTable(data);
  }

  async delete(element: any) {
    const deleted = await lastValueFrom(this.humansService.deleteHuman(element.id));
    this.loadHumans(this.pageSize, 0); 
    if (deleted) {
      this._utilsService.showMessage("Vet record successfully deleted",2000,true);
    }
  }

  edit(element: any) {
    this.router.navigate(['/master/human/', element.id]);
  }

  goToLoation(element: any){
    this.router.navigate(['/locations'], { queryParams: { human: element.id } });
  }
  downloadFile(){
    this.humansService.downloadFile("humans.xlsx");
  }
  massiveAdd(){
    const dialogRef = this.dialog.open(MassiveAddComponent, {
      width: '400px',
      height: "300px",
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Modal cerrado:', result);
    });
  }
}
