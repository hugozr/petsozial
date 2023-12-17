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
import { UsersService } from '../../../services/users.service';
import { environment } from '../../../../environments/environment';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';



@Component({
  selector: 'app-users',
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
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = [
    'username',
    'name',
    'email',
    'roles',
    'thumbnail',
    'actions',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  users: any[] = [];
  dataSource = new MatTableDataSource(this.users);
  backendURL = environment.backendPetZocialURL;


  constructor(
    private usersService: UsersService,
    private _utilsService: UtilsService,
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  async loadUsers() {
    const data: any = await this.usersService.getUsers();
    this.users = [];
    data.map((elem: any) => {
      const imagePath = elem.human?.humanImage?.sizes?.thumbnail?.url;
      this.users.push({
        id: elem.id,
        username: elem.username,
        name: elem.human ? elem.human.name : null,    //HZUMAETA: Si existe humano registrado va, sino no va
        roles: this.usersService.getRoleLabels(elem.roles),
        email: elem.email,
        thumbnail: imagePath ? (this.backendURL + imagePath) : null
      });
    });
    this.dataSource = new MatTableDataSource(this.users);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    console.log(this.dataSource);
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue;
  }

  async delete(element: any) {
    const deleted = await lastValueFrom(this.usersService.deleteUser(element.id));
    this.loadUsers(); //TODO: No volver a cargar la tabla
    if (deleted) {
      this._utilsService.showMessage("User record successfully deleted",2000,true);
    }
  }

  edit(element: any) {
    this.router.navigate(['/security/user/', element.id]);
  }

  otraAccion() {
    console.log('Otra Acción');
  }
}
