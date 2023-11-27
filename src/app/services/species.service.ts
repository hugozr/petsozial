import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';
import { Specie } from '../interfaces/specie';

@Injectable({
  providedIn: 'root',
})
export class SpeciesService {
  constructor(private http: HttpClient) {}

  async getSpecies(): Promise<Specie[]> {
    const species: any = await lastValueFrom(this.http.get<any[]>('http://localhost:3000/api/species?sort=order'));
    return species.docs;
  }
}
