import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { lastValueFrom } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { UtilsService } from '../../../services/utils.service';
import { environment } from '../../../../environments/environment';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HumansService } from '../../../services/humans.service';

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


  constructor(
    private humansService: HumansService,
    private _utilsService: UtilsService,
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadHumans();
  }

  async loadHumans() {
    const data: any = await this.humansService.getHumans();
    this.humans = [];
    data.map((elem: any) => {
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
    this.dataSource.paginator = this.paginator;
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue;
  }

  async delete(element: any) {
    const deleted = await lastValueFrom(this.humansService.deleteHuman(element.id));
    this.loadHumans(); //TODO: No volver a cargar la tabla
    if (deleted) {
      this._utilsService.showMessage("Vet record successfully deleted",2000,true);
    }
  }

  edit(element: any) {
    this.router.navigate(['/master/human/', element.id]);
  }


  otraAccion() {
    console.log('Otra Acción');
  }
}
