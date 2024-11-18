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
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatIconModule
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
  selectedCommunities: any[] = [];
  pageSize: number = 6;
  totalRows: number = 0;
  pageSizeOptions: number[] = [6, 20, 50];
  // userData: any;

  constructor(
    private usersService: UsersService,
    private communitiesService: CommunitiesService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  async ngOnInit(): Promise<void> {
    //TODO: Se puede seleccionar por ahora publicos, pero con el mimso componente podemos seleccionar comuniadades privadas
    const a = await this.loadCommunities(this.data.modality, this.pageSize, 0);
    this.selectedCommunities = await this.usersService.getCommunitiesByUsername(this.data.username);
    // console.log(this.selectedCommunities, "este es un arreglo de comunidaddes")
  }

  async loadCommunities(modality: string, pageSize: number, page: number) {
    // const data: any = await this.communitiesService.getPublicCommunities(pageSize, page);
    const data: any = await this.communitiesService.getCommunitiesByModality(modality,pageSize, page);
    console.log(data);
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
    this.loadCommunities(this.data.modality, event.pageSize, event.pageIndex + 1);
  }

  async onCheckboxChange(event: MatCheckboxChange, row: any): Promise<void> {
    const body: any = { community: row.id, username: this.data.username };
    if (event.checked) {
      const added = await this.usersService.insertCommunityByUsername(body);
      console.log(added);
    } else {
      const deleted = await this.usersService.deleteCommunityByUsername(body);
      this.selectedCommunities = this.selectedCommunities.filter(community => community !== deleted.id);

      console.log(deleted);
    }
    // const user = await this.usersService.updateCommunity(this.userData.id, {operation, "communityId": row.id});
  }

  communityIsSelected(id: string) {
    // console.log(this.userData.communities, "que tiene")
    // if (this.userData.communities == undefined) return false;
    // const found = this.userData.communities.find((community: any) => community.id === id);
    // return found ? true : false;

    if (this.selectedCommunities == undefined) return false;
    const found = this.selectedCommunities.find((communityId) => communityId === id);
    return found ? true : false;
  }

  checkboxLabel(row?: any): string {
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
}