import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeoserverService {

  private geoserverUrl = 'http://localhost:8081/geoserver'; 
  private layer = "ws_geolocations_peru:l_districts";
  private geometry = "the_geom"

  constructor(private http: HttpClient) {}

  getGeoData(x: number, y: number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        "Access-Control-Allow-Origin": "true"
      })
    };
    //TODO: Sale error de CORS pero en Postman si funciona
    //TODO: Falta averiguar como se usa Geoserver con volumenes para que no se pierda los shapes que voy cargando
    const url = `${this.geoserverUrl}/wfs?service=wfs&request=GetFeature&version=1.1.0&typeName=${this.layer}&outputFormat=application/json&CQL_FILTER=INTERSECTS(${this.geometry},POINT(-12.12178065-77.0304221110424))`
    return this.http.get(url, httpOptions);
  }
}
