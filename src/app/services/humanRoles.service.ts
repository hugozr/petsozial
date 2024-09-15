import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root',
})
export class HumanRolesService {
  backendURL = environment.backendPetZocialCareURL;

  constructor(
    private http: HttpClient,
    private _utilsServices: UtilsService,
    ) {}

  async getHumanRoles(): Promise<any[]> {
    const url = `${this.backendURL}/api/human-to-pet-roles`;
    const roles: any = await lastValueFrom(this.http.get<any[]>(url)); 
    return roles.docs;    
  }

  async getPetContactHuman(humanId: string, petId: string): Promise<any> {
    return await lastValueFrom(this.http.get<any>(`${this.backendURL}/api/pet-humans/${humanId}/${petId}/retrieve-contact`));
  }
  
  async getHumansByPet(petId: string): Promise<any> {
    return await lastValueFrom(this.http.get<any>(`${this.backendURL}/api/pet-humans/${petId}/retrieve-contacts`));
  }

  async setPetContactHuman(humanId: string, petId: string, roles: any, data: any): Promise<any> {
    const body = {
      humanId,
      petId,
      roles: roles.roles,
      humanData: data.humanData,
      petData: data.petData,
    };
    return await lastValueFrom(this.http.post<any>(`${this.backendURL}/api/pet-humans`, body));
  }
  
  downloadFile(fileName: string){
    this._utilsServices.downloadExcel(`${this.backendURL}/api/humans/download-in-excel`).subscribe(response => {
      this._utilsServices.saveFile(response.body, fileName);
    });
  }
}
