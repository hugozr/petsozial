import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppOption } from '../interfaces/appOption';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PortalService {
  backendURL = environment.backendPetZocialURL;

  constructor(private http: HttpClient) {}

  getOptions(): Observable<AppOption[]> {
    // console.log("yonque")
    return this.http.get<AppOption[]>(`${this.backendURL}/api/options?sort=order&limit=20`);
  }
  getWelcome(): Observable<any[]> {
    return this.http.get<any[]>(`${this.backendURL}/api/globals/welcome`);
  }
}
