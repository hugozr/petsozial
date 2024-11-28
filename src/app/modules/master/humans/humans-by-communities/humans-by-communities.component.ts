import { Component, Inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { environment } from '../../../../../environments/environment';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { CommunitiesService } from '../../../../services/communities.service';
import { HumanToCommunityComponent } from '../../../community/communities/human-to-community/human-to-community.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UtilsService } from '../../../../services/utils.service';

@Component({
  selector: 'app-humans-by-communities',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatMenuModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './humans-by-communities.component.html',
  styleUrl: './humans-by-communities.component.css'
})
export class HumansByCommunitiesComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  communityId: any;
  humans: any[] = [];
  
  pageSize: number = 10;
  totalRows: number = 0;
  pageSizeOptions: number[] = [10, 50, 100];
  timeoutId!: any;

  displayedColumns: string[] = [
    'nickName',
    'name',
    'position',
    'contact',
    'thumbnail',
    'actions',
  ];

  dataSource = new MatTableDataSource(this.humans);
  backendURL = environment.backendPetZocialURL;

  constructor(
    private communitiesService: CommunitiesService,
    private _utilsService: UtilsService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
  }

  async ngOnInit(): Promise<void> {
    this.communityId = this.data.community.id;
    await this.loadHumans(this.pageSize, 0);
  }

  async loadHumans(pageSize: number, page: number) {
    const data = await this.communitiesService.retrieveHumansByCommunity(pageSize, page, "", this.communityId);
    this.fillHumanTable(data);
  }

  fillHumanTable(data: any){
    this.humans = [];

    console.log(data, "ver");
    for (const item of data) {
      const imagePath = item.human.humanImage?.sizes?.thumbnail?.url;
      this.humans.push({
        id: item.id,
        humanId: item.human.id,
        nickName: item.human.nickName,
        name: item.human.name,
        comment: item.human.comment,
        email: item.human.email,
        address: item.human.address,
        phone: item.human.phone,
        socialUrl: item.human.socialUrl,
        position: item.position.name,
        positionDescription: item.position.description,
        thumbnail: imagePath ? (this.backendURL + imagePath) : null
      });
    };

    this.dataSource = new MatTableDataSource(this.humans);
    this.dataSource.sort = this.sort;
    this.totalRows = data.length;
    this.pageSize = data.limit;
  }

  pageChanged(event: PageEvent) {
    this.loadHumans(event.pageSize, event.pageIndex + 1);
  }

  async delete(element: any){
    const deleted = await this.communitiesService.deleteHumanByCommunity(element.id);
    if (deleted) {
      await this.loadHumans(this.pageSize, 0);
      this._utilsService.showMessage("Community record successfully deleted", 2000, true);
    }
  }

  addHuman() {
    const dialogRef = this.dialog.open(HumanToCommunityComponent, {
      width: '500px',
      height: "400px",
      data: {community: this.data.community},
    });

    dialogRef.afterClosed().subscribe(async (result: any) => {
        await this.loadHumans(this.pageSize, 0);
    });
  }
}
