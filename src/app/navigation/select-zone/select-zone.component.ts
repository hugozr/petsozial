import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { ZonesService } from '../../services/zones.service';
import { EventsService } from '../../services/events.service';

@Component({
  selector: 'app-select-zone',
  standalone: true,
  imports: [
    CommonModule,
    MatSelectModule
  ],
  templateUrl: './select-zone.component.html',
  styleUrl: './select-zone.component.css'
})
export class SelectZoneComponent {
  @Output() selectedZoneEvent = new EventEmitter<string>();
  selectedZone: string | null = null;
  zones: any = [];
  constructor(
    private zonesServices: ZonesService,
    private eventsServices: EventsService
  ) { }

  async ngOnInit(): Promise<void> {
    this.zones = await this.zonesServices.getZones();
    const storedZone = localStorage.getItem('selectedZone');
    if (storedZone) {
      this.selectedZone = storedZone;
    } else {
      this.selectedZone = this.zones[0];
      if(this.selectedZone){
        localStorage.setItem('selectedZone', this.selectedZone);
      }
    }
    this.zonesServices.setCurrentZone(this.selectedZone!);
  }

  onZoneChange() {
    if (this.selectedZone) {
      this.zonesServices.emitSelectedZone(this.selectedZone); // Emitir el valor seleccionado a través del servicio
      localStorage.setItem('selectedZone', this.selectedZone);
      this.eventsServices.emitEvent(this.selectedZone);
    }
  }
}
