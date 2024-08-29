import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, Observable } from 'rxjs';
import { AppOption } from '../interfaces/appOption';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  backendURL = environment.backendPetZocialURL;
  constructor(private http: HttpClient) {}

  
  // getSettings(): Observable<any[]> {
  //   return this.http.get<any[]>(`${this.backendURL}/api/globals/settings`);
  // }

  async getSettings(): Promise<any[]> {
    const settings: any = await lastValueFrom(this.http.get<any[]>(`${this.backendURL}/api/globals/settings`)); 
    return settings;
  }

}
