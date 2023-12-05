// import { CommonModule } from '@angular/common';
// import { MatToolbarModule } from '@angular/material/toolbar';
// import { UtilsService } from '../../../services/utils.service';
// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-veterinaries',
//   standalone: true,
//   imports: [
//     CommonModule,
//     MatToolbarModule,
//   ],
//   templateUrl: './veterinaries.component.html',
//   styleUrl: './veterinaries.component.css'
// })
// export class VeterinariesComponent {
//   constructor(private _utilsService: UtilsService) { }


// }

import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { lastValueFrom } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { UtilsService } from '../../../services/utils.service';
import { VetsService } from '../../../services/vets.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-veterinaries',
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
  templateUrl: './veterinaries.component.html',
  styleUrl: './veterinaries.component.css'
})
export class VeterinariesComponent implements OnInit  {
  displayedColumns: string[] = [
    'name',
    'social',
    'comment',
    'phone',
    'address',
    'email',
    'thumbnail',
    'actions',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  vets: any[] = [];
  dataSource = new MatTableDataSource(this.vets);
  backendURL = environment.backendPetZocialURL;

  
  constructor(
    private vetsService: VetsService,
    private _utilsService: UtilsService,
    private router: Router
    ) {}

  ngOnInit(): void {
     this.loadVets();
  }

  async loadVets() {
    const data: any = await this.vetsService.getVets();
    this.vets = [];
    data.map((elem: any) => {
      const imagePath = elem.vetImage?.sizes?.thumbnail?.url;
      this.vets.push({
        id: elem.id,
        name: elem.name,
        comment: elem.comment,
        email: elem.email,
        address: elem.address,
        phone: elem.phone,
        url: elem.url,
        thumbnail: imagePath ? (this.backendURL + imagePath) : null
      });
    });
    this.dataSource = new MatTableDataSource(this.vets);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    console.log(this.dataSource);
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue;
  }

  async delete(element: any) {
    const deleted = await lastValueFrom(this.vetsService.deleteVet(element.id));
    this.loadVets(); //TODO: No volver a cargar la tabla
    if(deleted){
      this._utilsService.showMessage("Vet record successfully deleted");
    }
  }

  edit(element: any) {
    this.router.navigate(['/pet-health/veterinary/', element.id]);
  }

  otraAccion() {
    console.log('Otra Acción');
  }
}
