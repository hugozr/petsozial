import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';
import { Pet } from '../interfaces/pet';
import { environment } from '../../environments/environment';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root',
})
export class PetsService {
  constructor(
    private http: HttpClient,
    private _utilsServices: UtilsService,
    ) {}
  backendURL = environment.backendPetZocialURL;
  
  async getPets(limit: number, page: number, filter: string): Promise<Pet[]> {
    return this.filterPets(limit,page,'');
  }

  async getPetsByZone(zoneId: string, limit: number, page: number, filter: string): Promise<Pet[]> {
    return this.filterPetsByZone(zoneId, limit, page,'');
  }

  async filterPetsByZone(zoneId: string, limit: number, page: number, filter: string): Promise<any> {
    const body = {
      filter,
      limit,
      page,
      zone: zoneId
    }
    return await lastValueFrom(this.http.put(`${this.backendURL}/api/pets/filter-me-by-zone`, body));
  }
  
  async filterPets(limit: number, page: number, filter: string): Promise<any> {
    const body = {
      filter,
      limit,
      page
    }
    return await lastValueFrom(this.http.put(`${this.backendURL}/api/pets/filter-me`, body));
  }
  async filterPetsByHumanId(limit: number, page: number, filter: string, humanId: string): Promise<any> {
    const body = {
      filter,
      limit,
      page,
      id: humanId
    }
    return await lastValueFrom(this.http.put(`${this.backendURL}/api/pets/by-human-id`, body));
  }

  // async filterPetsByCommunityId(limit: number, page: number, filter: string, id: string): Promise<any> {
  //   const body = {
  //     filter,
  //     limit,
  //     page,
  //     id
  //   }
  //   return await lastValueFrom(this.http.put(`${this.backendURL}/api/pets/by-community-id`, body));
  // }

  async getPet(id: string): Promise<Pet> {
    const pet: any = await lastValueFrom(this.http.get<Pet[]>(`${this.backendURL}/api/pets/${id}`)); 
    return pet;
  }

  async insertPet(pet: Pet): Promise<Pet> {
    return await lastValueFrom(this.http.post<Pet>(`${this.backendURL}/api/pets/`, pet));
  }

  async updatePet(id: any, pet: Pet): Promise<Pet> {
    return await lastValueFrom(this.http.put<Pet>(`${this.backendURL}/api/pets/${id}`, pet));
  }
  
  async patchPet(id: any, petData: any): Promise<Pet> {
    const pet = await lastValueFrom(this.http.patch<Pet>(`${this.backendURL}/api/pets/${id}`, petData));
    return pet;
  }

  deletePet(id: string): Observable<Pet> {
    return this.http.delete<Pet>(`${this.backendURL}/api/pets/${id}`);
  }
  downloadFile(fileName: string){
    this._utilsServices.downloadExcel(`${this.backendURL}/api/pets/download-in-excel`).subscribe(response => {
      this._utilsServices.saveFile(response.body, fileName);
    });
  }
}
