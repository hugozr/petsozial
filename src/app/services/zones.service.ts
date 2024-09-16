import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, lastValueFrom } from 'rxjs';
import { Specie } from '../interfaces/specie';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ZonesService {
  backendURL = environment.backendPetZocialURL;
  // Crear un Subject para emitir y escuchar cambios de zona
  private selectedZoneSource = new Subject<string>();
  // Observable al que se pueden suscribir otros componentes
  selectedZone$ = this.selectedZoneSource.asObservable();
  private currentZone: string = "";
  
  constructor(private http: HttpClient) {}

  // Método para emitir un nuevo valor de zona seleccionada
  emitSelectedZone(zone: string) {
    this.selectedZoneSource.next(zone);
  }

  setCurrentZone(zone: string){
    this.currentZone = zone;
  }
  
  getCurrentZone(){
    return this.currentZone ;
  }

  async getZones(): Promise<any[]> {
    const zones: any = await lastValueFrom(this.http.get<any[]>(`${this.backendURL}/api/zones?sort=order`));
    return zones.docs;
  }
}
