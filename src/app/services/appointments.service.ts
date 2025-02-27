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

  // async filterAppointments1(
  //   filterIdName: string,
  //   id: string,
  //   limit: number,
  //   page: number,
  //   dateRange: any
  // ): Promise<any> {
  //   const dateFilter = "&where[_and_][0][appointmentDate][greater_than_equal]=2025-02-01&where[_and_][1][appointmentDate][less_than_equal]=2025-02-14"
  //   // const dateFilter = "";
  //   return await lastValueFrom(
  //     this.http.get(
  //       `${this.backendHealthURL}/api/appointments?sort=-createdAt&where[${filterIdName}][equals]=${id}&limit=${limit}&page=${page}${dateFilter}`
  //     )
  //   );
  // }
  async filterAppointments(filterIdName: string, id: string, limit: number, page: number, dateRange: any): Promise<any> {
    const body = {
      filterIdName,
      id,
      limit,
      page,
      dateRange
    }
    return await lastValueFrom(this.http.put(`${this.backendHealthURL}/api/appointments/filter-me`, body));
  }
  async getAppointment(id: string): Promise<any> {
    const appointment: any = await lastValueFrom(
      this.http.get<any[]>(`${this.backendHealthURL}/api/appointments/${id}`)
    );
    return appointment;
  }

  async getPetHealthRecords(appointmentId: any): Promise<any> {
    return await lastValueFrom(
      this.http.get<any>(
        `${this.backendHealthURL}/api/pet-health-records/${appointmentId}/by-appointment-id`
      )
    );
  }

  async insertAppointment(appointment: any): Promise<any> {
    return await lastValueFrom(
      this.http.post<any>(
        `${this.backendHealthURL}/api/appointments/`,
        appointment
      )
    );
  }

  
  async insertPetHealthRecord(record: any): Promise<any> {
    return await lastValueFrom(
      this.http.post<any>(
        `${this.backendHealthURL}/api/pet-health-records/`,
        record
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

  async updatePetHealthRecord(id: string, record: any): Promise<any> {
    return await lastValueFrom(
      this.http.put<any>(
        `${this.backendHealthURL}/api/pet-health-records/${id}`,
        record
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
