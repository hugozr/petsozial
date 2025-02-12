import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';
import { Vet } from '../interfaces/vet';
import { environment } from '../../environments/environment';
import { VetType } from '../interfaces/vetType';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root',
})
export class AppointmentsService {
  backendURL = environment.backendPetZocialURL;
  backendHealthURL = environment.backendPetZocialHealthURL;

  constructor(private http: HttpClient) {}

  async filterAppointments(
    filterIdName: string,
    id: string,
    limit: number,
    page: number
  ): Promise<any> {
    return await lastValueFrom(
      this.http.get(
        `${this.backendHealthURL}/api/appointments?sort=-createdAt&where[${filterIdName}][equals]=${id}&limit=${limit}&page=${page}`
      )
    );
  }
  async getAppointment(id: string): Promise<any> {
    const appointment: any = await lastValueFrom(
      this.http.get<any[]>(`${this.backendHealthURL}/api/appointments/${id}`)
    );
    return appointment;
  }

  async insertAppointment(appointment: any): Promise<any> {
    return await lastValueFrom(
      this.http.post<any>(
        `${this.backendHealthURL}/api/appointments/`,
        appointment
      )
    );
  }

  async updateAppointment(id: string, appointment: any): Promise<any> {
    return await lastValueFrom(
      this.http.put<any>(
        `${this.backendHealthURL}/api/appointments/${id}`,
        appointment
      )
    );
  }
  async patchAppointment(id: any, appointmentData: any): Promise<any> {
    console.log(appointmentData)
      const appointment = await lastValueFrom(this.http.patch<any>(`${this.backendHealthURL}/api/appointments/${id}`, appointmentData));
      return appointment;
    }

  deleteAppointment(id: string): Observable<any> {
    return this.http.delete<any>(`${this.backendHealthURL}/api/appointments/${id}`);
  }

  }
