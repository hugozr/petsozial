import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';
import { Specie } from '../interfaces/specie';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SpeciesService {
  backendURL = environment.backendPetZocialURL;


  constructor(private http: HttpClient) {}

  async getSpecies(): Promise<Specie[]> {
    const species: any = await lastValueFrom(this.http.get<any[]>(`${this.backendURL}/api/species?sort=order`));
    return species.docs;
  }
}
