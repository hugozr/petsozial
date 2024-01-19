import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  keycloakHost = environment.keycloakHost;

  constructor(private http: HttpClient) {}

  async getUsers(limit: number, page: number): Promise<User[]> {
    const url = `${this.backendURL}/api/users?sort=-createdAt&limit=${limit}&page=${page}`;
    const users: any = await lastValueFrom(this.http.get<User[]>(url));
    return users;
  }

  async filterUsers(limit: number, page: number, filter: string): Promise<any> {
    const body = {
      filter,
      limit,
      page
    }
    return await lastValueFrom(this.http.put(`${this.backendURL}/api/users/filter-me`, body));
  }

  async updateCommunity(userId: string, body: any): Promise<any> {
    return await lastValueFrom(this.http.put(`${this.backendURL}/api/users/${userId}/community-update`, body));
  }

  async getUsersByName(username: string): Promise<User[]> {
    const url = `${this.backendURL}/api/users/${username}/users-by-name`;
    const users: any = await lastValueFrom(this.http.get<User[]>(url));
    return users;
  }

  async getUsersByEmail(email: string): Promise<User[]> {
    const url = `${this.backendURL}/api/users/${email}/users-by-email`;
    const users: any = await lastValueFrom(this.http.get<User[]>(url));
    return users;
  }
  async getUser(id: string): Promise<User> {
    const user: any = await lastValueFrom(this.http.get<User[]>(`${this.backendURL}/api/users/${id}`));
    return user;
  }

  async insertUser(user: User): Promise<User> {
    return await lastValueFrom(this.http.post<User>(`${this.backendURL}/api/users/`, user));
  }

  async updateUser(id: any, user: User): Promise<User> {
    return await lastValueFrom(this.http.put<User>(`${this.backendURL}/api/users/${id}`, user));
  }

  async patchUser(id: any, userData: any): Promise<User> {
    const user = await lastValueFrom(this.http.patch<User>(`${this.backendURL}/api/users/${id}`, userData));
    return user;
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

  async getAccessTokens(){
    const tokenPath = `${this.keycloakHost}/realms/petzocial/protocol/openid-connect/token`;
    // const tokenPath = `${this.keycloakHost}/realms/master/protocol/openid-connect/token`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'multipart/form-data',
      
      })
    };

    //TODO: No puedo traer el access token para con eso despues crear usuarios
    const formData = new FormData();
    // formData.append('client_id', "petzocial");
    formData.append('client_id', "petzocial");
    // formData.append('username', "hzumaeta");
    // formData.append('password', "1234");

    formData.append('username', "claudio");
    formData.append('password', "1234");
    // formData.append('client_secret', "86KqtzfDfEuiqaDWh3hTTgJ8gW877XtL");
    formData.append('grant_type', "password");


    console.log(formData);
    return await lastValueFrom(this.http.post<any>(tokenPath, formData));
  }
}
