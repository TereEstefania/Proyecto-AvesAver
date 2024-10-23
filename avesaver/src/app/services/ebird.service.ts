import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EbirdService {
  private apiUrl = 'https://api.ebird.org/v2';
  private apiKey = 'ulvdeag8tq1e';  // Reemplaza con tu clave de API de eBird

  constructor(private http: HttpClient) {}

  // Método para obtener los avistamientos recientes en una región
  getAvistRecientes(regionCode: string): Observable<any> {
    const headers = new HttpHeaders().set('X-eBirdApiToken', this.apiKey);
    return this.http.get(`${this.apiUrl}/data/obs/${regionCode}/recent`, { headers })
      .pipe(
        catchError(error => {
          console.error('Error fetching recent observations:', error);
          return throwError(() => new Error('Error al obtener avistamientos recientes'));
        })
      );
  }

  // Método para obtener las subregiones (provincias o regiones) de un país
  getProvinciasPorPais(countryCode: string): Observable<any> {
    const headers = new HttpHeaders().set('X-eBirdApiToken', this.apiKey);
    return this.http.get(`${this.apiUrl}/ref/region/list/subnational1/${countryCode}`, { headers });
  }

  // Método para obtener los países
  getPaises(): Observable<any> {
    const headers = new HttpHeaders().set('X-eBirdApiToken', this.apiKey);
    return this.http.get(`${this.apiUrl}/ref/region/list/country/world`, { headers });
  }
}
