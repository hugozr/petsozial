import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';
import { AppOption } from '../interfaces/appOption';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {

  backendURL = environment.backendPetZocialURL;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  showMessage (message: string, duration?: number) {
    this.snackBar.open(message, 'Cerrar', {
      duration: duration || 2000, // duración en milisegundos
    });
  }

  async uploadFile(mediaData: any): Promise<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'multipart/form-data'
      })
    };
    const formData = new FormData();
    formData.append('file', mediaData.file);
    formData.append('alt', mediaData.alt);
    formData.append('objId', mediaData.objId);
    console.log("paloma",mediaData, formData);
    return await lastValueFrom(this.http.post<any>(`${this.backendURL}/api/media`, formData));
  }
  search(array: any, searchKey: string, returnKey: string, identifier: string) {
    const result = array.find((item: any) => item[searchKey] === identifier);
    return result ? result[returnKey] || '' : '';
  }
}
