import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';
import { Vet } from '../interfaces/vet';
import { environment } from '../../environments/environment';
import { HealthService } from '../interfaces/healthService';

@Injectable({
  providedIn: 'root',
})
export class VetsService {
  backendURL = environment.backendPetZocialURL;

  constructor(private http: HttpClient) {}

  async getVets(): Promise<Vet[]> {
    const pets: any = await lastValueFrom(this.http.get<Vet[]>(`${this.backendURL}/api/vets?sort=-createdAt&limit=100`)); 
    return pets.docs;
  }

  async getHealthService(): Promise<HealthService[]> {
    const healthService: any = await lastValueFrom(this.http.get<HealthService[]>(`${this.backendURL}/api/health-services?sort=-createdAt&limit=100`)); 
    return healthService.docs;
  }

  async getVet(id: string): Promise<Vet> {
    const pet: any = await lastValueFrom(this.http.get<Vet[]>(`${this.backendURL}/api/vets/${id}`)); 
    return pet;
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
