import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppOption } from '../interfaces/appOption';

@Injectable({
  providedIn: 'root',
})
export class OptionsService {
  constructor(private http: HttpClient) {}

  getOptions(): Observable<AppOption[]> {
    return this.http.get<AppOption[]>('http://localhost:3000/api/options?sort=order');
  }
}
