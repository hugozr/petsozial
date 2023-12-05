import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { PetsService } from '../../../services/pets.service';
import { lastValueFrom } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { UtilsService } from '../../../services/utils.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-pets',
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
  templateUrl: './pets.component.html',
  styleUrl: './pets.component.css',
})
export class PetsComponent implements OnInit  {
  displayedColumns: string[] = [
    'name',
    'human',
    'comment',
    'specie',
    'breed',
    'sex',
    'birthday',
    'thumbnail',
    'actions',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  pets: any[] = [];
  dataSource = new MatTableDataSource(this.pets);
  backendURL = environment.backendPetZocialURL;

  
  constructor(
    private petsService: PetsService,
    private _utilsService: UtilsService,
    private router: Router
    ) {}

  ngOnInit(): void {
     this.loadPets();
  }

  async loadPets() {
    const data: any = await this.petsService.getPets();
    this.pets = [];
    data.map((elem: any) => {
      const imagePath = elem.petImage?.sizes?.thumbnail?.url

      this.pets.push({
        id: elem.id,
        name: elem.name,
        human: elem.human,
        sex: elem.sex,
        specie: elem.specie.name,
        breed: elem.breed.name,
        birthday: elem.birthday,
        comment: elem.comment,
        thumbnail: imagePath ? (this.backendURL + imagePath) : null
      });
    });
    this.dataSource = new MatTableDataSource(this.pets);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    console.log(this.dataSource);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue;
  }

  async delete(element: any) {
    // Lógica para la acción eliminar
    const deleted = await lastValueFrom(this.petsService.deletePet(element.id));
    this.loadPets(); //TODO: No volver a cargar la tabla
    if(deleted){
      this._utilsService.showMessage("Pet record successfully deleted");
    }
  }

  edit(element: any) {
    this.router.navigate(['/master/pet/', element.id]);
  }

  otraAccion() {
    // Lógica para otra acción
    console.log('Otra Acción');
  }
}
