import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EbirdService {
  private apiUrl = 'https://api.ebird.org/v2';
  private apiKey = 'ulvdeag8tq1e'; 

  constructor(private http: HttpClient) {}

  /**
  * @function getAvistRecientes
  * @param codRegion de tipo string corresponde al codigo de una region especifica
  * @return {Observable} retorna los datos de la respuesta de la solicitud http o lanzará un error si no se pueden obtener los datos
  * @description esta funcion permite obterner los avistamientos recientes de una región especifica
  */
  getAvistRecientes(codRegion: string): Observable<any> {
    const headers = new HttpHeaders().set('X-eBirdApiToken', this.apiKey);
    return this.http.get(`${this.apiUrl}/data/obs/${codRegion}/recent`, { headers })
      .pipe(
        catchError(error => {
          console.error('Error al obtener avistamientos recientes:', error);
          return throwError(() => new Error('Error al obtener avistamientos recientes'));
        })
      );
  }

  /**
  * @function getProvinciasPorPais
  * @param codPais de tipo string corresponde al codigo de una region especifica
  * @return {Observable} retorna los datos de la respuesta de la solicitud http
  * @description esta funcion permite obterner las subregiones de un pais especifico
  */
  getProvinciasPorPais(codPais: string): Observable<any> {
    const headers = new HttpHeaders().set('X-eBirdApiToken', this.apiKey);
    return this.http.get(`${this.apiUrl}/ref/region/list/subnational1/${codPais}`, { headers });
  }

  /**
  * @function getPaises
  * @return {Observable} retorna los datos de la respuesta de la solicitud http
  * @description esta funcion permite obterner todos los paises donde se registraron avistamientos
  */
  getPaises(): Observable<any> {
    const headers = new HttpHeaders().set('X-eBirdApiToken', this.apiKey);
    return this.http.get(`${this.apiUrl}/ref/region/list/country/world`, { headers });
  }
}
