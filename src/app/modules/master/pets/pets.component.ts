import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { PetsService } from '../../../services/pets.service';
import { Pet } from '../../../interfaces/pet';
import { lastValueFrom } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-pets',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatTableModule,
    MatIconModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule
  ],
  templateUrl: './pets.component.html',
  styleUrl: './pets.component.css',
})
export class PetsComponent implements OnInit  {
  displayedColumns: string[] = [
    'name',
    'comment',
    'specie',
    'breed',
    'sex',
    'birthday',
    'actions',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  pets: Pet[] = [];
  dataSource = new MatTableDataSource(this.pets);

  constructor(
    private petsService: PetsService,
    private _snackBar: MatSnackBar
    ) {}

  ngOnInit(): void {
    
    this.loadPets();
  }
  async loadPets() {
    const data: any = await lastValueFrom(this.petsService.getPets());
    this.pets = [];
    data.docs.map((elem: any) => {
      this.pets.push({
        id: elem.id,
        name: elem.name,
        sex: elem.sex,
        specie: elem.specie,
        birthday: elem.birthday,
        breed: elem.breed,
        comment: elem.comment,
      });
    });
    this.dataSource = new MatTableDataSource(this.pets);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue;
  }

  async eliminar(element: any) {
    // Lógica para la acción eliminar
    console.log('Eliminar', element);
    const deleted = await lastValueFrom(this.petsService.deletePet(element.id));
    this.loadPets(); //TODO: No volver a cargar la tabla
  }

  modificar() {
    // Lógica para la acción modificar
    console.log('Modificar');
    this._snackBar.open('Pet record successfully deleted', 'View details', {
      duration: 2000,
      horizontalPosition: "center",
      verticalPosition: "bottom",
    });
  }

  otraAccion() {
    // Lógica para otra acción
    console.log('Otra Acción');
  }
}
