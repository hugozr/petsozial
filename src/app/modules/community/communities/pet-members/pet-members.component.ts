// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-pet-members',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './pet-members.component.html',
//   styleUrl: './pet-members.component.css'
// })
// export class PetMembersComponent {

// }

import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
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
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { UtilsService } from '../../../../services/utils.service';
import { CommunitiesService } from '../../../../services/communities.service';
import { MatDialog } from '@angular/material/dialog';
import { PetToComunityComponent } from '../pet-to-comunity/pet-to-comunity.component';
import { MassiveAddComponent } from '../../../../panels/massive-add/massive-add.component';

@Component({
  selector: 'app-pet-members',
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
    RouterModule
  ],
  templateUrl: './pet-members.component.html',
  styleUrl: './pet-members.component.css',
})
export class PetMembersComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'human',
    'comment',
    'specie',
    'breed',
    'gender',
    'birthday',
    'thumbnail',
    'actions',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  pets: any[] = [];
  dataSource = new MatTableDataSource(this.pets);
  backendURL = environment.backendPetZocialURL;

  pageSize: number = 10;
  totalRows: number = 0;
  pageSizeOptions: number[] = [10, 50, 100];
  timeoutId!: any;
  communityId!: string;
  community!: any;
  petMembers!: any;

  constructor(
    private communitiesService: CommunitiesService,
    private _utilsServices: UtilsService,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.communityId = params['id']; // Reemplaza 'id' con el nombre de tu parámetro
    });
    this.loadPets(this.pageSize, 0, "",this.communityId);
  }

  async loadPets(pageSize: number, page: number, filter: string, communityId: string ) {
    //TODO: Falta paginar
    this.community = await this.communitiesService.getCommunity(this.communityId);
    const pets = await this.communitiesService.getPetMembers(this.communityId);
    console.log(pets, "llenar")
    // if(this.community.petMembers) this.fillPetTable(this.community.petMembers);
    if(pets) this.fillPetTable(pets);
  }

  fillPetTable(data: any){
    console.log("dadada", data);
    this.pets = [];
    data.map((elem: any) => {
      const imagePath = elem.pet.petImage?.sizes?.thumbnail?.url
      this.pets.push({
        id: elem.pet.id,
        name: elem.pet.name,
        human: elem.pet.human.name,
        gender: elem.pet.gender,
        specie: elem.pet.specie.name,
        breed: elem.pet.breed.name,
        birthday: elem.pet.birthday,
        comment: elem.pet.comment,
        thumbnail: imagePath ? (this.backendURL + imagePath) : null
      });
      console.log(imagePath, elem);
      console.log(this.backendURL);
    });
    this.dataSource = new MatTableDataSource(this.pets);
    this.dataSource.sort = this.sort;
    
    this.totalRows = data.totalDocs;
    this.pageSize = data.limit;
  }

  pageChanged(event: PageEvent) {
    this.loadPets(event.pageSize, event.pageIndex + 1,"",this.communityId);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
 }

  async delete(element: any) {
    // const deleted = await this.communitiesService.updatePetMember(this.communityId, {"operation": "delete", "petId": element.id});
    // this.loadPets(this.pageSize, 0,"",this.communityId); 
    // if (deleted) {
    //   this._utilsServices.showMessage("Pet record successfully deleted", 2000, true);
    // }
    const toDelete: any = {
      communityId: this.communityId,
      petId: element.id
    }
    const deleted = await this.communitiesService.deletePetMembers(toDelete);
    this.loadPets(this.pageSize, 0,"",this.communityId);  //TODO: Refrescar optimizadamente
    if (deleted) {
      this._utilsServices.showMessage("Pet record successfully deleted", 2000, true);
    }
  }

  asignPet(){
    const ids = this.community.petMembers?.map((pet:any) => pet.id) || [];
    const dialogRef = this.dialog.open(PetToComunityComponent, {
      width: '500px',
      height: "600px",
      data: {"communityId": this.communityId, "petMemberIds": ids},
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result)
      if(result) {
        this.loadPets(this.pageSize, 0, "", this.communityId);
        
        // this.form.get('humanName')?.setValue(result.name);
        // this.form.get('hiddenHumanId')?.setValue(result.id);
      }
    });
  }

  MassiveAddMembers(){
    const dialogRef = this.dialog.open(MassiveAddComponent, {
      width: '500px',
      height: "500px",
      data: {typeFile: "pets", filterId: this.communityId},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Modal cerrado:', result);
    });
  }
}

