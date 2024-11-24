import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { HealthService } from '../interfaces/healthService';
import { Human } from '../interfaces/human';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root',
})
export class HumansService {
  backendURL = environment.backendPetZocialURL;

  constructor(
    private http: HttpClient,
    private _utilsServices: UtilsService,
    ) {}

  async getHumans(limit: number, page: number): Promise<Human[]> {
    const url = `${this.backendURL}/api/humans?sort=-createdAt&limit=${limit}&page=${page}`;
    const humans: any = await lastValueFrom(this.http.get<Human[]>(url)); 
    return humans;    
  }
  
  async getPetsByHumanEmail(email: string): Promise<any>{
    const pets: any = await lastValueFrom(this.http.get<any>(`${this.backendURL}/api/humans/${email}/pets-by-human-email`)); 
    return pets;
  }

  async filterHumans(limit: number, page: number, filter: string): Promise<any> {
    const body = {
      filter,
      limit,
      page
    }
    return await lastValueFrom(this.http.put(`${this.backendURL}/api/humans/filter-me`, body));
  }

  async getHuman(id: string): Promise<Human> {
    const human: any = await lastValueFrom(this.http.get<Human[]>(`${this.backendURL}/api/humans/${id}`)); 
    return human;
  }

  async getHumansByEmail(email: string): Promise<any> {
    const humans: any = await lastValueFrom(this.http.get<any>(`${this.backendURL}/api/humans/${email}/by-email`)); 
    return humans;
  }

  async insertHuman(human: Human): Promise<Human> {
    return await lastValueFrom(this.http.post<Human>(`${this.backendURL}/api/humans/`, human));
  }

  async updateHuman(id: any, human: Human): Promise<Human> {
    return await lastValueFrom(this.http.put<Human>(`${this.backendURL}/api/humans/${id}`, human));
  }
  
  async patchHuman(id: any, humanData: any): Promise<Human> {
    const pet = await lastValueFrom(this.http.patch<Human>(`${this.backendURL}/api/humans/${id}`, humanData));
    return pet;
  }

  deleteHuman(id: string): Observable<Human> {
    return this.http.delete<Human>(`${this.backendURL}/api/humans/${id}`);
  }

  //En este sector vamos a incluir las operaciones de los humanos con las mascotas
  async assignHumanToPet(humanId: string, petId: string): Promise<Human> {
    return await lastValueFrom(this.http.post<any>(`${this.backendURL}/api/humans/${humanId}/assigned-to/${petId}`, null));
  }
  
  downloadFile(fileName: string){
    this._utilsServices.downloadExcel(`${this.backendURL}/api/humans/download-in-excel`).subscribe(response => {
      this._utilsServices.saveFile(response.body, fileName);
    });
  }
}
