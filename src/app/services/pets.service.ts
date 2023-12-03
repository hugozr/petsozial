import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';
import { Pet } from '../interfaces/pet';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PetsService {
  constructor(private http: HttpClient) {}
  backendURL = environment.backendPetZocialURL;
  
  async getPets(): Promise<Pet[]> {
    const pets: any = await lastValueFrom(this.http.get<Pet[]>(`${this.backendURL}/api/pets?sort=-createdAt&limit=100`)); 
    return pets.docs;
  }

  async getPet(id: string): Promise<Pet> {
    const pet: any = await lastValueFrom(this.http.get<Pet[]>(`${this.backendURL}/api/pets/${id}`)); 
    return pet;
  }

  async insertPet(pet: Pet): Promise<Pet> {
    return await lastValueFrom(this.http.post<Pet>(`${this.backendURL}/api/pets/`, pet));
  }

  async updatePet(id: any, pet: Pet): Promise<Pet> {
    return await lastValueFrom(this.http.put<Pet>(`${this.backendURL}/api/pets/${id}`, pet));
  }
  
  async patchPet(id: any, petData: any): Promise<Pet> {
    const pet = await lastValueFrom(this.http.patch<Pet>(`${this.backendURL}/api/pets/${id}`, petData));
    return pet;
  }

  deletePet(id: string): Observable<Pet> {
    return this.http.delete<Pet>(`${this.backendURL}/api/pets/${id}`);
  }
}
