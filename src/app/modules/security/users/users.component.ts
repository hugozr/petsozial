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
import { UsersService } from '../../../services/users.service';
import { environment } from '../../../../environments/environment';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SelectCommunitiesComponent } from './select-communities/select-communities.component';
import { SettingsService } from '../../../services/settings.service';

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

  pageSize: number = 10;
  totalRows: number = 0;
  pageSizeOptions: number[] = [10, 50, 100];
  timeoutId!: any;
  roles: any = null;

  constructor(
    private usersService: UsersService,
    private _utilsService: UtilsService,
    private router: Router,
    public dialog: MatDialog,
    public settingsService: SettingsService
  ) { }

  async ngOnInit(): Promise<void> {
    const settings: any = await this.settingsService.getSettings();
    this.roles = settings.roles; 
    this.loadUsers(this.pageSize, 0);
  }

  async loadUsers(pageSize: number, page: number) {
    const data: any = await this.usersService.getUsers(pageSize, page);
    this.fillUserTable(data);
  }

  fillUserTable(data: any) {

    this.users = [];
    data.docs.map((elem: any) => {
      const imagePath = elem.human?.humanImage?.sizes?.thumbnail?.url;
      const filledUser: any = {
        id: elem.id,
        username: elem.username,
        name: elem.human ? elem.human.name : null,    //HZUMAETA: Si existe humano registrado va, sino no va
        // roles: this.usersService.getRoleLabels(elem.roles),
        roles: this.usersService.getRoleLabels(elem.roles, this.roles),
        email: elem.email,
        communities: elem.communities,
        thumbnail: imagePath ? (this.backendURL + imagePath) : null
      };
      console.log(filledUser, "tiene el arrreglo?");
      this.users.push(filledUser);
    });
    console.log(this.users, "bacion?");
    this.dataSource = new MatTableDataSource(this.users);
    this.dataSource.sort = this.sort;

    this.totalRows = data.totalDocs;
    this.pageSize = data.limit;

  }

  pageChanged(event: PageEvent) {
    this.loadUsers(event.pageSize, event.pageIndex + 1);
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
    const data: any = await this.usersService.filterUsers(this.pageSize, 0, filter);
    this.fillUserTable(data);
  }

  async selectCommunities(element: any) {
    const dialogRef = this.dialog.open(SelectCommunitiesComponent, {
      width: '600px',
      height: "500px",
      data: element,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Modal cerrado:', result);
    });
  }

  async delete(element: any) {
    const deleted = await lastValueFrom(this.usersService.deleteUser(element.id));
    this.loadUsers(this.pageSize, 0);
    if (deleted) {
      this._utilsService.showMessage("User record successfully deleted", 2000, true);
    }
  }

  async manageCredentials(element: any) {
    
  }

  edit(element: any) {
    this.router.navigate(['/security/user/', element.id]);
  }

  otraAccion() {
    console.log('Otra Acción');
  }
  downloadFile(){
    this.usersService.downloadFile("users.xlsx");
  }
}
