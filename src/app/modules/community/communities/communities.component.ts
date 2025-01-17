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
import { Router, RouterModule } from '@angular/router';
import { UtilsService } from '../../../services/utils.service';
import { CommunitiesService } from '../../../services/communities.service';
import { environment } from '../../../../environments/environment';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../../../services/auth.service';
import { EventsService } from '../../../services/events.service';
import { ZonesService } from '../../../services/zones.service';
import { HumansByCommunitiesComponent } from '../../master/humans/humans-by-communities/humans-by-communities.component';

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
    'modality',
    'comment',
    'address',
    'user',
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
  userName = null;
  selectedZone: string = "";
  private eventSubscription?: Subscription;

  constructor(
    private communitiesService: CommunitiesService,
    private _utilsService: UtilsService,
    private _authService: AuthService,
    private router: Router,
    public dialog: MatDialog,
    private eventsServices: EventsService,
    private zonesServices: ZonesService

  ) { }

  ngOnInit(): void {
    this.userName = this._authService.getUserName();  //HZUMAETA Solo puede crear comunidades un usuario logeado
    this.selectedZone = this.zonesServices.getCurrentZone();

    this.loadCommunitiesByZone(this.selectedZone, this.pageSize, 0);
    this.eventSubscription = this.eventsServices.event$.subscribe(data => {
      this.selectedZone = data;
      this.loadCommunitiesByZone(data, this.pageSize, 0);
    });
  }

  async loadCommunitiesByZone(zoneId:string, pageSize: number, page: number) {
    const data: any = await this.communitiesService.getCommunitiesByZone(zoneId, pageSize, page);
    this.fillCommunityTable(data);
  }

  fillCommunityTable(data: any) {
    this.communities = [];
    data.docs.map((elem: any) => {
      const imagePath = elem.communityImage?.sizes?.thumbnail?.url;
      this.communities.push({
        id: elem.id,
        name: elem.name,
        comment: elem.comment,
        type: elem.type?.name,
        typeId: elem.type?.id,
        address: elem.address,
        modality: elem.modality,
        user: elem.kcUserName,
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
    // this.loadCommunities(event.pageSize, event.pageIndex + 1);
    this.loadCommunitiesByZone(this.selectedZone, event.pageSize, event.pageIndex + 1);
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
    // const data: any = await this.communitiesService.filterCommunities(this.pageSize, 0, filter);
    const data: any = await this.communitiesService.filterCommunitiesByZone(this.pageSize, 0, filter, this.selectedZone);
    this.fillCommunityTable(data);
  }

  async delete(element: any) {
    const canDelete: any = await lastValueFrom(this.communitiesService.canDeleteCommunity(element.id));
    console.log(canDelete)
    if (canDelete.canDelete) {
      const deleted = await lastValueFrom(this.communitiesService.deleteCommunity(element.id));
      if (deleted) {
        this.loadCommunitiesByZone(this.selectedZone, this.pageSize, 0);      //TODO: Optimizar
        this._utilsService.showMessage("Community record successfully deleted", 2000, true);
      }
    } else {
      this._utilsService.showMessage("You cannot delete this community: " + canDelete.message, 2000, true);
    }
  }

  onRowClick(row: any) {
    console.log(row); // prints the data for the clicked row
    // perform any other actions you want when a row is clicked
  }

  edit(element: any) {
    this.router.navigate(['/community/community/', element.id]);
  }

  goToLocation(element: any) {
    this.router.navigate(['/locations'], { queryParams: { community: element.id } });
  }
  goToPetMembers(element: any) {
    this.router.navigate(['/community/pet-members', element.id]);
  }

  goToOrganization(community: any) {
    const dialogRef = this.dialog.open(HumansByCommunitiesComponent, {
      width: '900px',
      height: "600px",
      data: {community},
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result)
      if(result) {
        // this.loadPets(this.pageSize, 0, "", this.communityId);
      }
    });
  }
  
  addCommunity() {
    // this.userName = this._authService.getUserName();
    if (this.userName) {
      this.router.navigate(['/community/community']);
    } else {
      if (confirm('You need to be logged in. Will you log in?')) {
        this._authService.login();
      }
    }
  }
}


