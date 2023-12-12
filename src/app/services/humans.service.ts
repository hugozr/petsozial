import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { HealthService } from '../interfaces/healthService';
import { Human } from '../interfaces/human';

@Injectable({
  providedIn: 'root',
})
export class HumansService {
  backendURL = environment.backendPetZocialURL;

  constructor(private http: HttpClient) {}

  async getHumans(): Promise<Human[]> {
    const pets: any = await lastValueFrom(this.http.get<Human[]>(`${this.backendURL}/api/Humans?sort=-createdAt&limit=100`)); 
    return pets.docs;
  }

  async getHealthService(): Promise<HealthService[]> {
    const healthService: any = await lastValueFrom(this.http.get<HealthService[]>(`${this.backendURL}/api/health-services?sort=-createdAt&limit=100`)); 
    return healthService.docs;
  }

  async getHuman(id: string): Promise<Human> {
    const pet: any = await lastValueFrom(this.http.get<Human[]>(`${this.backendURL}/api/Humans/${id}`)); 
    return pet;
  }

  async insertHuman(pet: Human): Promise<Human> {
    return await lastValueFrom(this.http.post<Human>(`${this.backendURL}/api/Humans/`, pet));
  }

  async updateHuman(id: any, pet: Human): Promise<Human> {
    return await lastValueFrom(this.http.put<Human>(`${this.backendURL}/api/Humans/${id}`, pet));
  }
  
  async patchHuman(id: any, petData: any): Promise<Human> {
    const pet = await lastValueFrom(this.http.patch<Human>(`${this.backendURL}/api/Humans/${id}`, petData));
    return pet;
  }

  deleteHuman(id: string): Observable<Human> {
    return this.http.delete<Human>(`${this.backendURL}/api/Humans/${id}`);
  }
}
