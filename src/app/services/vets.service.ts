import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';
import { Vet } from '../interfaces/vet';
import { environment } from '../../environments/environment';
import { HealthService } from '../interfaces/healthService';
import { VetType } from '../interfaces/vetType';

@Injectable({
  providedIn: 'root',
})
export class VetsService {
  backendURL = environment.backendPetZocialURL;

  constructor(private http: HttpClient) {}

  async getVets(limit: number, page: number): Promise<Vet[]> {
    const url = `${this.backendURL}/api/vets?sort=-createdAt&limit=${limit}&page=${page}`
    const vets: any = await lastValueFrom(this.http.get<Vet[]>(url)); 
    return vets;
  }

  async filterVets(limit: number, page: number, filter: string): Promise<any> {
    const body = {
      filter,
      limit,
      page
    }
    return await lastValueFrom(this.http.put(`${this.backendURL}/api/vets/filter-me`, body));
  }

  async getVetTypes(): Promise<VetType[]> {
    const types: any = await lastValueFrom(this.http.get<VetType[]>(`${this.backendURL}/api/vet-types?sort=-name&limit=0`)); 
    return types.docs;
  }

  async getHealthService(): Promise<HealthService[]> {
    const healthService: any = await lastValueFrom(this.http.get<HealthService[]>(`${this.backendURL}/api/health-services?sort=-createdAt&limit=0`)); 
    return healthService.docs;
  }

  async getVet(id: string): Promise<Vet> {
    const vet: any = await lastValueFrom(this.http.get<Vet[]>(`${this.backendURL}/api/vets/${id}`)); 
    return vet;
  }

  async insertVet(vet: Vet): Promise<Vet> {
    return await lastValueFrom(this.http.post<Vet>(`${this.backendURL}/api/vets/`, vet));
  }

  async updateVet(id: any, vet: Vet): Promise<Vet> {
    return await lastValueFrom(this.http.put<Vet>(`${this.backendURL}/api/vets/${id}`, vet));
  }
  
  async patchVet(id: any, vetData: any): Promise<Vet> {
    const pet = await lastValueFrom(this.http.patch<Vet>(`${this.backendURL}/api/vets/${id}`, vetData));
    return pet;
  }

  deleteVet(id: string): Observable<Vet> {
    return this.http.delete<Vet>(`${this.backendURL}/api/vets/${id}`);
  }
}
