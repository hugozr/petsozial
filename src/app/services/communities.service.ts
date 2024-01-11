import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { HealthService } from '../interfaces/healthService';
import { Community } from '../interfaces/community';
import { CommunityType } from '../interfaces/communityType';

@Injectable({
  providedIn: 'root',
})
export class CommunitiesService {
  backendURL = environment.backendPetZocialURL;

  constructor(private http: HttpClient) {}

  async getCommunities(limit: number, page: number): Promise<Community[]> {
    const url = `${this.backendURL}/api/communities?sort=-createdAt&limit=${limit}&page=${page}`
    const comms: any = await lastValueFrom(this.http.get<Community[]>(url));
    console.log(comms,"aaaaaaaaaaaaaaaafffff")
    return comms;
  }
  
  async filterCommunities(limit: number, page: number, filter: string): Promise<any> {
    const body = {
      filter,
      limit,
      page
    }
    return await lastValueFrom(this.http.put(`${this.backendURL}/api/communities/filter-me`, body));
  }

  async getCommunityTypes(): Promise<CommunityType[]> {
    const healthService: any = await lastValueFrom(this.http.get<CommunityType[]>(`${this.backendURL}/api/community-types?sort=-name&limit=0`)); 
    return healthService.docs;
  }

  async getHealthService(): Promise<HealthService[]> {
    const healthService: any = await lastValueFrom(this.http.get<HealthService[]>(`${this.backendURL}/api/health-services?sort=-createdAt&limit=100`)); 
    return healthService.docs;
  }

  async getCommunity(id: string): Promise<Community> {
    const pet: any = await lastValueFrom(this.http.get<Community[]>(`${this.backendURL}/api/communities/${id}`)); 
    return pet;
  }

  async insertCommunity(community: Community): Promise<Community> {
    return await lastValueFrom(this.http.post<Community>(`${this.backendURL}/api/communities/`, community));
  }

  async updateCommunity(id: any, community: Community): Promise<Community> {
    return await lastValueFrom(this.http.put<Community>(`${this.backendURL}/api/communities/${id}`, community));
  }
  
  async patchCommunity(id: any, communityData: any): Promise<Community> {
    const pet = await lastValueFrom(this.http.patch<Community>(`${this.backendURL}/api/communities/${id}`, communityData));
    return pet;
  }

  deleteCommunity(id: string): Observable<Community> {
    return this.http.delete<Community>(`${this.backendURL}/api/communities/${id}`);
  }
}
