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

  async getHumans(limit: number, page: number): Promise<Human[]> {
    const url = `${this.backendURL}/api/humans?sort=-createdAt&limit=${limit}&page=${page}`;
    const humans: any = await lastValueFrom(this.http.get<Human[]>(url)); 
    return humans;    
  }
  
  async filterHumans(limit: number, page: number, filter: string): Promise<any> {
    const body = {
      filter,
      limit,
      page
    }
    return await lastValueFrom(this.http.put(`${this.backendURL}/api/humans/filter-me`, body));
  }

  async getHealthService(): Promise<HealthService[]> {
    const healthService: any = await lastValueFrom(this.http.get<HealthService[]>(`${this.backendURL}/api/health-services?sort=-createdAt&limit=100`)); 
    return healthService.docs;
  }

  async getHuman(id: string): Promise<Human> {
    const pet: any = await lastValueFrom(this.http.get<Human[]>(`${this.backendURL}/api/Humans/${id}`)); 
    return pet;
  }

  async insertHuman(human: Human): Promise<Human> {
    return await lastValueFrom(this.http.post<Human>(`${this.backendURL}/api/Humans/`, human));
  }

  async updateHuman(id: any, human: Human): Promise<Human> {
    return await lastValueFrom(this.http.put<Human>(`${this.backendURL}/api/Humans/${id}`, human));
  }
  
  async patchHuman(id: any, humanData: any): Promise<Human> {
    const pet = await lastValueFrom(this.http.patch<Human>(`${this.backendURL}/api/Humans/${id}`, humanData));
    return pet;
  }

  deleteHuman(id: string): Observable<Human> {
    return this.http.delete<Human>(`${this.backendURL}/api/Humans/${id}`);
  }
}
