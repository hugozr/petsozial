import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

interface zociedad {
  value: string;
  viewValue: string;
}

interface zociedadGroup {
  disabled?: boolean;
  name: string;
  zociedad: zociedad[];
}

@Component({
  selector: 'app-my-communities',
  standalone: true,
  imports: [
    CommonModule,
    MatOptionModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule
  ],
  providers:[
    
  ],
  templateUrl: './my-communities.component.html',
  styleUrl: './my-communities.component.css'
})
export class MyCommunitiesComponent {
  zociedadControl = new FormControl('');
  zociedadGroups: zociedadGroup[] = [
    {
      name: 'Mis domicilios',
      zociedad: [
        { value: '1', viewValue: 'Condominio Los Huertos de Surco' },
        { value: '2', viewValue: 'Distrito de Surco' },
        { value: '3', viewValue: 'Urbanización el Bosque' },
      ],
    },
    {
      name: 'Mis veterinarias',
      zociedad: [
        { value: '10', viewValue: 'Patitas' },
        { value: '11', viewValue: 'Dogtor' },
        { value: '12', viewValue: 'Petcare' },
      ],
    },
    {
      name: 'Mis tiendas',
      disabled: true,
      zociedad: [
        { value: '20', viewValue: 'Petshop San Isidro' },
        { value: '21', viewValue: 'Novedades caninas' },
        { value: '22', viewValue: 'Catstore' },
      ],
    },
    {
      name: 'Mis clientes',
      zociedad: [
        { value: '30', viewValue: 'De tutoria' },
        { value: '31', viewValue: 'De cuidados' },
      ],
    },
  ];
}
