import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';
import { Petshop } from '../interfaces/petshop';
import { environment } from '../../environments/environment';
import { HealthService } from '../interfaces/healthService';
import { PetshopType } from '../interfaces/petshopType';

@Injectable({
  providedIn: 'root',
})
export class PetshopsService {
  backendURL = environment.backendPetZocialURL;

  constructor(private http: HttpClient) {}

  async getPetshops(limit: number, page: number): Promise<Petshop[]> {
    const url = `${this.backendURL}/api/petshops?sort=-createdAt&limit=${limit}&page=${page}`
    const petshops: any = await lastValueFrom(this.http.get<Petshop[]>(url)); 
    return petshops;
  }

  async filterPetshops(limit: number, page: number, filter: string): Promise<any> {
    const body = {
      filter,
      limit,
      page
    }
    return await lastValueFrom(this.http.put(`${this.backendURL}/api/petshops/filter-me`, body));
  }

  async getPetshopTypes(): Promise<PetshopType[]> {
    const types: any = await lastValueFrom(this.http.get<PetshopType[]>(`${this.backendURL}/api/petshop-types?sort=-name&limit=0`)); 
    return types.docs;
  }

  // async getHealthService(): Promise<HealthService[]> {
  //   const healthService: any = await lastValueFrom(this.http.get<HealthService[]>(`${this.backendURL}/api/health-services?sort=-createdAt&limit=0`)); 
  //   return healthService.docs;
  // }

  async getPetshop(id: string): Promise<Petshop> {
    const petshop: any = await lastValueFrom(this.http.get<Petshop[]>(`${this.backendURL}/api/petshops/${id}`)); 
    return petshop;
  }

  async insertPetshop(petshop: Petshop): Promise<Petshop> {
    return await lastValueFrom(this.http.post<Petshop>(`${this.backendURL}/api/petshops/`, petshop));
  }

  async updatePetshop(id: any, petshop: Petshop): Promise<Petshop> {
    return await lastValueFrom(this.http.put<Petshop>(`${this.backendURL}/api/petshops/${id}`, petshop));
  }
  
  async patchPetshop(id: any, petshopData: any): Promise<Petshop> {
    const pet = await lastValueFrom(this.http.patch<Petshop>(`${this.backendURL}/api/petshops/${id}`, petshopData));
    return pet;
  }

  deletePetshop(id: string): Observable<Petshop> {
    return this.http.delete<Petshop>(`${this.backendURL}/api/petshops/${id}`);
  }
}
