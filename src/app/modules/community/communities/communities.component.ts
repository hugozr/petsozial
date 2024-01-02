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
import { CommunitiesService } from '../../../services/communities.service';
import { environment } from '../../../../environments/environment';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-communities',
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
  templateUrl: './communities.component.html',
  styleUrl: './communities.component.css'
})
export class CommunitiesComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'social',
    'type',
    'comment',
    'address',
    'thumbnail',
    'actions',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  communities: any[] = [];
  dataSource = new MatTableDataSource(this.communities);
  backendURL = environment.backendPetZocialURL;

  pageSize: number = 10;
  totalRows: number = 0;
  pageSizeOptions: number[] = [10, 50, 100];
  timeoutId!: any;

  constructor(
    private communitiesService: CommunitiesService,
    private _utilsService: UtilsService,
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadCommunities(this.pageSize, 0);
  }

  async loadCommunities(pageSize: number, page: number) {
    const data: any = await this.communitiesService.getCommunities(pageSize, page);
    this.fillHumanTable(data);
  }
  
  fillHumanTable(data: any){
    this.communities = [];
    data.docs.map((elem: any) => {
      const imagePath = elem.communityImage?.sizes?.thumbnail?.url;
      this.communities.push({
        id: elem.id,
        name: elem.name,
        comment: elem.comment,
        type: elem.type?.name,
        address: elem.address,
        url: elem.url,
        thumbnail: imagePath ? (this.backendURL + imagePath) : null
      });
    });
    this.dataSource = new MatTableDataSource(this.communities);
    this.dataSource.sort = this.sort;
    this.totalRows = data.totalDocs;
    this.pageSize = data.limit;
  }
  
  pageChanged(event: PageEvent) {
    this.loadCommunities(event.pageSize, event.pageIndex + 1);
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
    const data: any = await this.communitiesService.filterCommunities(this.pageSize, 0, filter);
    this.fillHumanTable(data);
  }
  
  async delete(element: any) {
    const deleted = await lastValueFrom(this.communitiesService.deleteCommunity(element.id));
    this.loadCommunities(this.pageSize, 0); 
    if (deleted) {
      this._utilsService.showMessage("Community record successfully deleted",2000,true);
    }
  }

  edit(element: any) {
    this.router.navigate(['/community/community/', element.id]);
  }

  goToLoation(element: any){
    this.router.navigate(['/locations'], { queryParams: { community: element.id } });
  }
}
