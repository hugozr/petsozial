import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';
import { User } from '../interfaces/user';
import { environment } from '../../environments/environment';
import { UtilsService } from './utils.service';
import axios, { AxiosResponse } from 'axios';
import * as querystring from 'querystring';
import { PortalService } from './portal.service';

const roles = [
  {
    label: 'I belong to a pet',
    value: 'ibtap',
    keycloakGroup: 'petzocial.humans'
  },
  {
    label: 'I care about the health of pets',
    value: 'icahp',
    keycloakGroup: 'petzocial.pet-vets'
  },
  {
    label: 'I take care of pets',
    value: 'itkp',
    keycloakGroup: 'petzocial.pet-caretakers'
  },
  {
    label: 'I manage a community of pets',
    value: 'imcp',
    keycloakGroup: 'petzocial.pet-communities'
  },
];

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  backendURL = environment.backendPetZocialURL;
  keycloakHost = environment.keycloakHost;
  clientId = environment.keycloakClientId;
  realm = environment.keycloakRealm;
  // roles: any =[];

  constructor(
    private http: HttpClient, 
    private _utilsServices: UtilsService,
  ) { 
  }

  async getUsers(limit: number, page: number): Promise<User[]> {
    const url = `${this.backendURL}/api/app-users?sort=-createdAt&limit=${limit}&page=${page}`;
    const users: any = await lastValueFrom(this.http.get<User[]>(url));
    return users;
  }

  async filterUsers(limit: number, page: number, filter: string): Promise<any> {
    const body = {
      filter,
      limit,
      page,
    };
    return await lastValueFrom(
      this.http.put(`${this.backendURL}/api/app-users/filter-me`, body)
    );
  }

  async updateCommunity(userId: string, body: any): Promise<any> {
    return await lastValueFrom(
      this.http.put(
        `${this.backendURL}/api/app-users/${userId}/community-update`,
        body
      )
    );
  }

  async getUsersByName(username: string): Promise<User[]> {
    const url = `${this.backendURL}/api/app-users/${username}/users-by-name`;
    const users: any = await lastValueFrom(this.http.get<User[]>(url));
    return users;
  }

  async getUsersByEmail(email: string): Promise<User[]> {
    const url = `${this.backendURL}/api/app-users/${email}/users-by-email`;
    const users: any = await lastValueFrom(this.http.get<User[]>(url));
    return users;
  }
  async getUser(id: string): Promise<User> {
    const user: any = await lastValueFrom(
      this.http.get<User[]>(`${this.backendURL}/api/app-users/${id}`)
    );
    return user;
  }

  async insertUser(user: User): Promise<User> {
    return await lastValueFrom(
      this.http.post<User>(`${this.backendURL}/api/app-users/`, user)
    );
  }

  async updateUser(id: any, user: User): Promise<User> {
    return await lastValueFrom(
      this.http.put<User>(`${this.backendURL}/api/app-users/${id}`, user)
    );
  }

  async patchUser(id: any, userData: any): Promise<User> {
    const user = await lastValueFrom(
      this.http.patch<User>(`${this.backendURL}/api/app-users/${id}`, userData)
    );
    return user;
  }

  //Servicios de negocio: Son los servicios que implementan las reglas de negocio
  async associateUserToHuman(userId?: string): Promise<any> {
    return await lastValueFrom(
      this.http.post<User>(
        `${this.backendURL}/api/app-users/${userId}/associate`,
        null
      )
    );
  }

  async syncronizeWithAppUser(keycloakUserId: any, keycloakUserName: any, keycloakEmail: any){
    console.log(keycloakUserId,keycloakUserName, keycloakEmail);
    const keycloakUserData = {
      keycloakUserId,
      keycloakUserName, 
      keycloakEmail};
      console.log(keycloakUserData, "ver los datos que voy a enviar");
    return await lastValueFrom(
      this.http.post<any>(`${this.backendURL}/api/app-users/sync-to-app-user`, keycloakUserData)
    );
  }

  deleteUser(id: string): Observable<User> {
    return this.http.delete<User>(`${this.backendURL}/api/app-users/${id}`);
  }

  getRoles(): any {
    return roles;
  }

  // async getRoleLabels(values: string[]) {
  //   const selectedLabels = roles
  //     .filter((role) => values.includes(role.value))
  //     .map((role) => role.label);
  //   return selectedLabels;
  // }

  getRoleLabels(values: string[], roles: any) {
    // console.log(roles, "que hay?");
    const selectedLabels = roles
      .filter((role:any) => values.includes(role.value))
      .map((role: any) => role.label);
    return selectedLabels;
  }

  async getAccessTokens(): Promise<any> {
    const tokenPath = `${this.keycloakHost}/realms/${this.realm}/protocol/openid-connect/token`;
    const postData = {
      client_id: this.clientId,
      username: environment.adminUsername,
      password: environment.adminPassword,
      grant_type: 'password',
    };
    const formData = querystring.stringify(postData);
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };

    try {
      const response: AxiosResponse<any> = await axios.post(
        tokenPath,
        formData,
        config
      );
      return response.data;
    } catch (error) {
      console.error('Error en la solicitud:', error);
      throw error;
    }
  }

  async insertKeycloakUser(token: string, newUserName: string, email: string, password: string): Promise<any> {
    try {
      const requestBody = {
        username: newUserName,
        email: email,
        enabled: true,
        credentials: [
          {
            type: 'password',
            value: password,
            temporary: false,
          },
        ],
      };

      const authHeader = { Authorization: `Bearer ${token}` };

      const response = await axios.post(`${this.keycloakHost}/admin/realms/${this.realm}/users`, requestBody, {
        headers: {
          ...authHeader,
          'Content-Type': 'application/json',
        },
      });
      return response.statusText;
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      throw error; // Puedes manejar el error de otra manera si es necesario
    }
  }

  async assignRoleToKeycloakUser(token: string, keycloakUserId: string, email: string, password: string): Promise<any> {
    try {

      const authHeader = { Authorization: `Bearer ${token}` };

      const response = await axios.post(`${this.keycloakHost}/admin/realms/${this.realm}/users`, {}, {
        headers: {
          ...authHeader,
          'Content-Type': 'application/json',
        },
      });
      return response.statusText;
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      throw error; // Puedes manejar el error de otra manera si es necesario
    }
  }
  async queryKeycloakUser(token: string, query: string): Promise<any> {
    try {
      const authHeader = { Authorization: `Bearer ${token}` };
      const response: any = await axios.get(`${this.keycloakHost}/admin/realms/${this.realm}/users?${query}`, {
        headers: {
          ...authHeader,
          'Content-Type': 'application/json',
        },
      });
      console.log(response, "Usuario obtenido exitosamente.");
      return response.data[0];
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      throw error; // Puedes manejar el error de otra manera si es necesario
    }
  }

  downloadFile(fileName: string) {
    this._utilsServices
      .downloadExcel(`${this.backendURL}/api/app-users/download-in-excel`)
      .subscribe((response) => {
        this._utilsServices.saveFile(response.body, fileName);
      });
  }
}
