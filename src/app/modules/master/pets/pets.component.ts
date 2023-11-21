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
    MatSortModule
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


  constructor(private petsService: PetsService) {}

  ngOnInit(): void {
    this.loadPets();
  }

  
  async loadPets() {
    const data: any = await lastValueFrom(this.petsService.getPets());
    data.docs.map((elem: any) => {
      this.pets.push({
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

  eliminar() {
    // Lógica para la acción eliminar
    console.log('Eliminar');
  }

  modificar() {
    // Lógica para la acción modificar
    console.log('Modificar');
  }

  otraAccion() {
    // Lógica para otra acción
    console.log('Otra Acción');
  }
}
