import { AfterViewInit, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MyPetsSelectorComponent } from "../my-pets-selector/my-pets-selector.component";
import { MyPetsGridComponent } from "../my-pets-grid/my-pets-grid.component";
import { SelectZoneComponent } from '../../../navigation/select-zone/select-zone.component';
import { ZonesService } from '../../../services/zones.service';

@Component({
  selector: 'app-my-pets',
  standalone: true,
  imports: [
    CommonModule,
    MyPetsSelectorComponent,
    MyPetsComponent,
    MyPetsGridComponent
],
  templateUrl: './my-pets.component.html',
  styleUrl: './my-pets.component.css',
})

export class MyPetsComponent {
  selectedZone: string = "";

  filterSelector: any = null;
  filterOptions:  any = null;
  constructor(
    private route: ActivatedRoute,
    private zonesServices: ZonesService
  ) { }

  ngOnInit(): void {
    this.selectedZone = this.zonesServices.getCurrentZone(); 
    // console.log(this.zonesServices.getCurrentZone(), "debe salir el current");
    this.route.data.subscribe(async (params: any) => {
      this.filterOptions = params;
    });

    // Suscribirse a los cambios en la zona seleccionada
    this.zonesServices.selectedZone$.subscribe(zone => {
      this.selectedZone = zone; // Actualizar la zona seleccionada
      console.log('Zona recibida en mypets:', this.selectedZone);
    });

  }

  onSelectedValueChange(value: any): void {
    this.filterSelector = value;
  }
}
