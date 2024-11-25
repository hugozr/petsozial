import { Component, Inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { environment } from '../../../../../environments/environment';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommunitiesService } from '../../../../services/communities.service';

@Component({
  selector: 'app-humans-by-communities',
  standalone: true,
  imports: [
    CommonModule,
    
    MatToolbarModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule
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
    'comment',
    'contact',
    'thumbnail',
  ];

  dataSource = new MatTableDataSource(this.humans);
  backendURL = environment.backendPetZocialURL;

  constructor(
    private communitiesService: CommunitiesService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
  }

  async ngOnInit(): Promise<void> {
    console.log(this.data, "mosr")
    this.communityId = this.data.community.id;
    await this.loadHumans(this.pageSize, 0);
  }

  async loadHumans(pageSize: number, page: number) {
    const data = await this.communitiesService.retrieveHumansByCommunity(pageSize, page, "", this.communityId);
    console.log(data, "drdo");  
    this.fillHumanTable(data);
  }

  fillHumanTable(data: any){
    this.humans = [];

    for (const human of data) {
      const imagePath = human.humanImage?.sizes?.thumbnail?.url;
      this.humans.push({
        id: human.id,
        nickName: human.nickName,
        name: human.name,
        comment: human.comment,
        email: human.email,
        address: human.address,
        phone: human.phone,
        socialUrl: human.socialUrl,
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
}
