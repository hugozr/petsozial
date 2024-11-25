import { Component, Inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HumansService } from '../../../../services/humans.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { environment } from '../../../../../environments/environment';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-humans-by-pets',
  standalone: true,
  imports: [
    CommonModule,

    MatToolbarModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule
  ],
  templateUrl: './humans-by-pets.component.html',
  styleUrl: './humans-by-pets.component.css'
})
export class HumansByPetsComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  petId: any;
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
    private humansService: HumansService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
  }

  async ngOnInit(): Promise<void> {
    this.petId = this.data.pet.id;
    console.log(this.petId,"aaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
    await this.loadHumans(this.pageSize, 0);
  }

  async loadHumans(pageSize: number, page: number) {
    const data = await this.humansService.retrieveHumansByPet(pageSize, page, "", this.petId);
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
