import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';
import { User } from '../interfaces/user';
import { environment } from '../../environments/environment';

const roles  = [
  {
    label: 'I belong to a pet',
    value: 'ibtap',
  },
  {
    label: 'I care about the health of pets',
    value: 'icahp',
  },
  {
    label: "I take care of pets",
    value: 'itkp',
  },
  {
    label: "I manage a community of pets",
    value: 'imcp',
  }
];

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  backendURL = environment.backendPetZocialURL;

  constructor(private http: HttpClient) {}

  async getUsers(): Promise<User[]> {
    const pets: any = await lastValueFrom(this.http.get<User[]>(`${this.backendURL}/api/users?sort=-createdAt&limit=100`)); 
    return pets.docs;
  }

  async getUser(id: string): Promise<User> {
    const pet: any = await lastValueFrom(this.http.get<User[]>(`${this.backendURL}/api/users/${id}`)); 
    return pet;
  }

  async insertUser(user: User): Promise<User> {
    return await lastValueFrom(this.http.post<User>(`${this.backendURL}/api/users/`, user));
  }

  async updateUser(id: any, user: User): Promise<User> {
    return await lastValueFrom(this.http.put<User>(`${this.backendURL}/api/users/${id}`, user));
  }
  
  async patchUser(id: any, userData: any): Promise<User> {
    const pet = await lastValueFrom(this.http.patch<User>(`${this.backendURL}/api/users/${id}`, userData));
    return pet;
  }

  //Servicios de negocio: Son los servicios que implementan las reglas de negocio
  async associateUserToHuman(userId?:string): Promise<any> {
    return await lastValueFrom(this.http.post<User>(`${this.backendURL}/api/users/${userId}/associate`,null));
  }

  deleteUser(id: string): Observable<User> {
    return this.http.delete<User>(`${this.backendURL}/api/users/${id}`);
  }

  getRoles(): any{
    return roles;
  }
  getRoleLabels(values: string[]){
    const selectedLabels = roles
        .filter(role => values.includes(role.value))
        .map(role => role.label);
    return selectedLabels;
  }
}
