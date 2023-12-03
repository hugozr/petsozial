import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';
import { Vet } from '../interfaces/vet';
import { environment } from '../../environments/environment';

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

  async getVet(id: string): Promise<Vet> {
    const pet: any = await lastValueFrom(this.http.get<Vet[]>(`${this.backendURL}/api/vets/${id}`)); 
    return pet;
  }

  async insertVet(pet: Vet): Promise<Vet> {
    return await lastValueFrom(this.http.post<Vet>(`${this.backendURL}/api/vets/`, pet));
  }

  async updateVet(id: any, pet: Vet): Promise<Vet> {
    return await lastValueFrom(this.http.put<Vet>(`${this.backendURL}/api/vets/${id}`, pet));
  }
  
  async patchVet(id: any, petData: any): Promise<Vet> {
    const pet = await lastValueFrom(this.http.patch<Vet>(`${this.backendURL}/api/vets/${id}`, petData));
    return pet;
  }

  deleteVet(id: string): Observable<Vet> {
    return this.http.delete<Vet>(`${this.backendURL}/api/vets/${id}`);
  }
}
