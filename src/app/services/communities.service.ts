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
    return comms;
  }
  
  async getCommunityById(id: string): Promise<any> {
    const url = `${this.backendURL}/api/communities/${id}`
    const comm: any = await lastValueFrom(this.http.get<any>(url));
    return comm;
  }

  async getCommunitiesByZone(zoneId: string, limit: number, page: number): Promise<Community[]> {
    const url = `${this.backendURL}/api/communities?sort=-createdAt&where[zone][equals]=${zoneId}&limit=${limit}&page=${page}&zone`
    const comms: any = await lastValueFrom(this.http.get<Community[]>(url));
    return comms;
  }
  
  async getPetMembers(communityId: string): Promise<any[]> {
    const petMembers: any = await lastValueFrom(this.http.get<any[]>(`${this.backendURL}/api/communities-by-pets/${communityId}/retrieve-pets`)); 
    return petMembers;
  }

  async petIsMember(communityId: string, petId: string): Promise<any[]> {
    const isMember: any = await lastValueFrom(this.http.get<any[]>(`${this.backendURL}/api/communities-by-pets/${communityId}/${petId}/is-member`)); 
    return isMember;
  }

  async deletePetMembers(body: any): Promise<any[]> {
    const deleted: any = await lastValueFrom(this.http.post<any[]>(`${this.backendURL}/api/communities-by-pets/delete`, body)); 
    return deleted.docs;
  }
  
  async getCommunitiesByModality(modality: string, limit: number, page: number): Promise<Community[]> {
    const url = `${this.backendURL}/api/communities?sort=-createdAt&where[modality][equals]=${modality}&limit=${limit}&page=${page}`
    const comms: any = await lastValueFrom(this.http.get<Community[]>(url));
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
  
  async filterCommunitiesByZone(limit: number, page: number, filter: string, zoneId: string): Promise<any> {
    const body = {
      filter,
      limit,
      page,
      zone: zoneId
    }
    return await lastValueFrom(this.http.put(`${this.backendURL}/api/communities/filter-me`, body));
  }

  async retrieveHumansByCommunity(limit: number, page: number, filter: string, communityId: string): Promise<any> {
    const body = {
      filter,
      limit,
      page
    }
    return await lastValueFrom(this.http.put(`${this.backendURL}/api/humans-by-communities/${communityId}/retrieve-humans`, body));
  }

  async updatePetMember(communityId: string, body: any): Promise<any> {
    return await lastValueFrom(this.http.put(`${this.backendURL}/api/communities/${communityId}/pet-update`, body));
  }

  async insertPetMember(body: any): Promise<any> {
    return await lastValueFrom(this.http.post(`${this.backendURL}/api/communities-by-pets/insert-member`, body));
  }


  async getCommunityTypes(modality: string): Promise<CommunityType[]> {
    const filter = "&where[modality][equals]=" +  modality;
    const communityTypes: any = await lastValueFrom(this.http.get<CommunityType[]>(`${this.backendURL}/api/community-types?sort=-name&limit=0${filter}`)); 
    return communityTypes.docs;
  }

  async getCommunityType(id: string): Promise<any> {
    const communityType: any = await lastValueFrom(this.http.get<CommunityType[]>(`${this.backendURL}/api/community-types/${id}`)); 
    return communityType;
  }

  async getCommunity(id: string): Promise<Community> {
    const community: any = await lastValueFrom(this.http.get<Community[]>(`${this.backendURL}/api/communities/${id}`)); 
    return community;
  }
  
  async getCommunitiesByUsername(kcUserName: string): Promise<Community> {
    const community: any = await lastValueFrom(this.http.get<Community[]>(`${this.backendURL}/api/communities/${kcUserName}/by-username`)); 
    return community;
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
