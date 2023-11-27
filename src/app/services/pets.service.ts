import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';
import { Pet } from '../interfaces/pet';

@Injectable({
  providedIn: 'root',
})
export class PetsService {
  constructor(private http: HttpClient) {}

  async getPets(): Promise<Pet[]> {
    const pets: any = await lastValueFrom(this.http.get<Pet[]>('http://localhost:3000/api/pets?sort=-createdAt&limit=100')); 
    return pets.docs;
  }

  async getPet(id: string): Promise<Pet> {
    const pet: any = await lastValueFrom(this.http.get<Pet[]>('http://localhost:3000/api/pets/'+ id)); 
    return pet;
  }

  async insertPet(pet: Pet): Promise<Pet> {
    return await lastValueFrom(this.http.post<Pet>('http://localhost:3000/api/pets/', pet));
  }

  async updatePet(id: any, pet: Pet): Promise<Pet> {
    return await lastValueFrom(this.http.put<Pet>('http://localhost:3000/api/pets/'+id, pet));
  }



  deletePet(id: string): Observable<Pet> {
    console.log("..........", id);
    return this.http.delete<Pet>('http://localhost:3000/api/pets/' + id);
  }
}
