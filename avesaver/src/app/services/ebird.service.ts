import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EbirdService {
  private apiUrl = 'https://api.ebird.org/v2';
  private apiUrlRegion = 'https://api.ebird.org/v2/ref/region/list/subnational1/AR';
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

// Método para obtener las subregiones de Argentina
getProvArg(): Observable<any> {
  const headers = new HttpHeaders().set('X-eBirdApiToken', this.apiKey);
  return this.http.get(this.apiUrlRegion, { headers });
}

}
