import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';
import { Vet } from '../interfaces/vet';
import { environment } from '../../environments/environment';
import { HealthService } from '../interfaces/healthService';
import { VetType } from '../interfaces/vetType';

@Injectable({
  providedIn: 'root',
})
export class VetCommunitiesService {
  backendHealthURL = environment.backendPetZocialHealthURL;

  constructor(
    private http: HttpClient,
    ) {}

  async getVetCommunities(vetId: string): Promise<any[]> {
    const url = `${this.backendHealthURL}/api/vet-communities/${vetId}/by-vet-id`
    const vets: any = await lastValueFrom(this.http.get<any[]>(url)); 
    return vets;
  }
  async setVetCommunities(vetCommunityData: any): Promise<any> {
    const community = await lastValueFrom(this.http.post<any>(`${this.backendHealthURL}/api/vet-communities/`, vetCommunityData));
    return community;
  }
  
  async unsetVetCommunities(vetCommunityId: string): Promise<any> {
    const deleteCommunity = await lastValueFrom(this.http.delete<any>(`${this.backendHealthURL}/api/vet-communities/${vetCommunityId}`));
    return deleteCommunity;
  }

}
