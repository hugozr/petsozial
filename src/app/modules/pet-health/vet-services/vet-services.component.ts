import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { VetsService } from '../../../services/vets.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-vet-services',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatCardModule

  ],
  templateUrl: './vet-services.component.html',
  styleUrl: './vet-services.component.css'
})
export class VetServicesComponent {
  // vetId = "6594428ce2aa1ef1b12a2c2d";

  allServices: any = [];
  availableServices: any = [];
  selectedServices: any = [];
  availableServicesMap: any = [];
  constructor(
    private vetsService: VetsService,
    @Inject(MAT_DIALOG_DATA) public vetData: any
  ) {
  }

  async ngOnInit() {
    this.allServices = await this.vetsService.getHealthServices();
    this.selectedServices = await this.vetsService.getVetServices(this.vetData.id);
    this.availableServices =  this.allServices.filter((hs: any) => !this.selectedServices.map((s:any) => s.healthServiceId).includes(hs.id));
    this.availableServicesMap = this.allServices.reduce((map: any, service: any) => {
      map[service.id] = service.name;
      return map;
    }, {});

    this.selectedServices = this.selectedServices.map((item: any) => {
      return {
        ...item,
        serviceName: this.availableServicesMap[item.healthServiceId] || 'Service not found'
      };
    });
    console.log(this.availableServices, this.selectedServices, "ver como carga los segundos selected");
  }

  async addOption(service: any) {
    const body: any = {
      healthServiceId: service.id,
      description: service.comment
    }
    const vetAddedVetService =  await this.vetsService.setHealthServices(this.vetData.id, body);
    if(vetAddedVetService){
      this.availableServices = this.availableServices.filter( (serv: any) => serv.id !== service.id);
      vetAddedVetService.serviceName = this.availableServicesMap[vetAddedVetService.healthServiceId] || 'Service not found'
      this.selectedServices.push(vetAddedVetService);
    }
  }

  async removeOption(option: string) {
    const unset =  await this.vetsService.unsetHealthServices(option);
    if(unset){
      this.selectedServices = this.selectedServices.filter((sel: any) => sel.healthServiceId !== unset.healthServiceId);
      const hservice = this.allServices.find((hs: any) => hs.id === unset.healthServiceId);
      this.availableServices.push(hservice);
    }
  }
}
