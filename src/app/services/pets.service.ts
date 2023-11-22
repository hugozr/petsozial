import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pet } from '../interfaces/pet';

@Injectable({
  providedIn: 'root',
})
export class PetsService {
  constructor(private http: HttpClient) {}

  getPets(): Observable<Pet[]> {
    // return this.http.get<Pet[]>('http://localhost:3000/api/pets?sort=createdAt&where[name][equals]=nnnn');
    return this.http.get<Pet[]>('http://localhost:3000/api/pets?sort=createdAt');
  }

  deletePet(id: string): Observable<Pet> {
    console.log("..........", id);
    return this.http.delete<Pet>('http://localhost:3000/api/pets/' + id);
  }
}
