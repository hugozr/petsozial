import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';
import { Vet } from '../interfaces/vet';
import { environment } from '../../environments/environment';
import { HealthService } from '../interfaces/healthService';
import { VetType } from '../interfaces/vetType';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root',
})
export class VetsService {
  backendURL = environment.backendPetZocialURL;
  backendHealthURL = environment.backendPetZocialHealthURL;

  constructor(
    private http: HttpClient,
    private _utilsServices: UtilsService,
    ) {}

  async getVets(limit: number, page: number): Promise<Vet[]> {
    const url = `${this.backendURL}/api/vets?sort=-createdAt&limit=${limit}&page=${page}`
    const vets: any = await lastValueFrom(this.http.get<Vet[]>(url)); 
    return vets;
  }

  async getVetsByZone(zoneId: string, limit: number, page: number, filter: string): Promise<Vet[]> {
    return this.filterVetsByZone(zoneId, limit, page, filter);
  }

  async filterVetsByZone(zoneId: string, limit: number, page: number, filter: string): Promise<any> {
    const body = {
      filter,
      limit,
      page,
      zone: zoneId
    }
    return await lastValueFrom(this.http.put(`${this.backendURL}/api/vets/filter-me-by-zone`, body));
  }

  async filterVets(limit: number, page: number, filter: string): Promise<any> {
    const body = {
      filter,
      limit,
      page
    }
    return await lastValueFrom(this.http.put(`${this.backendURL}/api/vets/filter-me`, body));
  }

  async getVetTypes(): Promise<VetType[]> {
    const types: any = await lastValueFrom(this.http.get<VetType[]>(`${this.backendURL}/api/vet-types?sort=-name&limit=0`)); 
    return types.docs;
  }

  async getHealthServices(): Promise<HealthService[]> {
    const healthService: any = await lastValueFrom(this.http.get<HealthService[]>(`${this.backendURL}/api/health-services?sort=-createdAt&limit=0`)); 
    return healthService.docs;
  }

  async getVet(id: string): Promise<Vet> {
    const vet: any = await lastValueFrom(this.http.get<Vet[]>(`${this.backendURL}/api/vets/${id}`)); 
    return vet;
  }

  async insertVet(vet: Vet): Promise<Vet> {
    return await lastValueFrom(this.http.post<Vet>(`${this.backendURL}/api/vets/`, vet));
  }

  async updateVet(id: any, vet: Vet): Promise<Vet> {
    return await lastValueFrom(this.http.put<Vet>(`${this.backendURL}/api/vets/${id}`, vet));
  }
  
  async patchVet(id: any, vetData: any): Promise<Vet> {
    const pet = await lastValueFrom(this.http.patch<Vet>(`${this.backendURL}/api/vets/${id}`, vetData));
    return pet;
  }

  deleteVet(id: string): Observable<Vet> {
    return this.http.delete<Vet>(`${this.backendURL}/api/vets/${id}`);
  }

  downloadFile(fileName: string){
    this._utilsServices.downloadExcel(`${this.backendURL}/api/vets/download-in-excel`).subscribe(response => {
      this._utilsServices.saveFile(response.body, fileName);
    });
  }

  async setHealthServices(vetId: any, vetSericeData: any): Promise<any> {
    const services = await lastValueFrom(this.http.post<any>(`${this.backendHealthURL}/api/vet-services/${vetId}/set-service`, vetSericeData));
    return services;
  }

  async unsetHealthServices(vetServiceId: string): Promise<any> {
    const deleteService = await lastValueFrom(this.http.delete<any>(`${this.backendHealthURL}/api/vet-services/${vetServiceId}`));
    return deleteService;
  }

  async getVetServices(vetId: any): Promise<any> {
    const vetServices = await lastValueFrom(this.http.get<any>(`${this.backendHealthURL}/api/vet-services/${vetId}/by-vet-id`));
    return vetServices;
  }

  async getVetCommunitiesForVet(vetId: any): Promise<any> {
    const vetCommunities = await lastValueFrom(this.http.get<any>(`${this.backendHealthURL}/api/vet-communities/${vetId}/by-vet-id`));
    return vetCommunities;
  }

  canDeleteVet(id: string): Observable<any> {
    return this.http.get<any>(`${this.backendHealthURL}/api/vet-communities/${id}/can-delete`);
  }

}
