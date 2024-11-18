import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { environment } from '../../environments/environment';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {

  backendURL = environment.backendPetZocialURL;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
  ) {}

  showMessage (message: string, duration?: number, isSuccess: boolean = true) {
    const panelClass = isSuccess ? ['mat-toolbar', 'mat-primary'] : ['mat-toolbar', 'mat-warn'];
    this.snackBar.open(message, 'Cerrar', {
      duration: duration || 2000, 
      panelClass: panelClass //TODO controlar los colores del snackbar
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
    return await lastValueFrom(this.http.post<any>(`${this.backendURL}/api/media`, formData));
  }
  
  async uploadExcelFile(mediaData: any): Promise<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/*'
      })
    };
    const formData = new FormData();
    formData.append('file', mediaData.file);
    formData.append('name', mediaData.name);
    formData.append('collection', mediaData.collection);
    formData.append('filterId', mediaData.filterId);
    formData.append('username', mediaData.username);
    return await lastValueFrom(this.http.post<any>(`${this.backendURL}/api/excels`, formData));
  }
  
  search(array: any, searchKey: string, returnKey: string, identifier: string) {
    const result = array.find((item: any) => item[searchKey] === identifier);
    return result ? result[returnKey] || '' : '';
  }

  createPatternValidator = (pattern: RegExp, errorMessage: string, errorKey: string): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value && !pattern.test(control.value)) {
        const errors: ValidationErrors = {};
        errors[errorKey] = true;
        errors['message'] = errorMessage;
        return errors;
      }
      return null;
    };
  };

  getSocialMediaFromUrl(url: string): string {
    // klarsys.github.io/angular-material-icons/
    if (url.includes('instagram.com')) {
      return 'info';
    } else if (url.includes('facebook.com')) {
      return 'facebook';
    } else {
      return 'home';
    }
  }

  canAccessThisPage(rule: string, username?: string): boolean{
    console.log(rule, username);
    if(rule == "only-with-username" && username != null) {
      return true;
    }
    return false
  }

  getShortenedComment(comment: string, maxLength: number): string {
    if (comment.length <= maxLength) {
      return comment;
    } else {
      return comment.substring(0, maxLength) + '...';
    }
  }

  downloadExcel(baseUrl: string): Observable<HttpResponse<Blob>> {
    return this.http.get(baseUrl, {
      responseType: 'blob',
      observe: 'response'
    });
  }

  saveFile(data: Blob | null, filename: string ) {
    if (data) {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } else {
      console.error('Error: El archivo recibido del servidor es nulo.');
    }
  }
  


}