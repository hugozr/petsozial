import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { UsersService } from '../../../../services/users.service';
import { CommunitiesService } from '../../../../services/communities.service';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule
  ],
  selector: 'app-select-communities',
  templateUrl: './select-communities.component.html',
  styleUrls: ['./select-communities.component.css']
})
export class SelectCommunitiesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['select', 'name', 'comment'];
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  communities: any[] = [];
  pageSize: number = 6;
  totalRows: number = 0;
  pageSizeOptions: number[] = [6, 20, 50];
  userData: any;

  constructor(
    private usersService: UsersService,
    private communitiesService: CommunitiesService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  async ngOnInit(): Promise<void> {
    this.userData = await this.usersService.getUser(this.data.id);
    await this.loadCommunities(this.pageSize, 0);
  }
  async loadCommunities(pageSize: number, page: number) {
    const data: any = await this.communitiesService.getCommunities(pageSize, page);
    this.communities = [];
    data.docs.map((elem: any) => {
      this.communities.push({
        id: elem.id,
        name: elem.name,
        comment: elem.comment
      });
    });
    this.dataSource = new MatTableDataSource(this.communities);
    this.totalRows = data.totalDocs;
    this.pageSize = data.limit;
  }

  pageChanged(event: PageEvent) {
    this.loadCommunities(event.pageSize, event.pageIndex + 1);
  }
  
  async onCheckboxChange(event: MatCheckboxChange, row: any): Promise<void> {
    let operation = "insert"
    if (event.checked) {
    } else {
      operation = "delete";
    }
    const user = await this.usersService.updateCommunity(this.userData.id, {operation, "communityId": row.id});
  }
  
  communityIsSelected(id: string){
    if(this.userData.communities == undefined ) return false;
    const found = this.userData.communities.find((community: any) => community.id === id);
    return found ? true : false;
  }

  checkboxLabel(row?: any): string {
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
}