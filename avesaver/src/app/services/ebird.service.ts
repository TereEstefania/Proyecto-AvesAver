import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EbirdService {
  private apiUrl = 'https://api.ebird.org/v2';
  private apiKey = 'n7n0vpgqpetq';  // Reemplaza con tu clave de API de eBird

  constructor(private http: HttpClient) {}

  // Método para obtener los avistamientos recientes en una región
  getRecentObservations(regionCode: string): Observable<any> {
    const url = `${this.apiUrl}/data/obs/${regionCode}/recent`;
    return this.http.get(url, {
      headers: {
        'X-eBirdApiToken': this.apiKey,
      },
    });
  }

  // Método para obtener observaciones de una especie específica
  getSpeciesObservations(regionCode: string, speciesCode: string): Observable<any> {
    const url = `${this.apiUrl}/data/obs/${regionCode}/recent/${speciesCode}`;
    return this.http.get(url, {
      headers: {
        'X-eBirdApiToken': this.apiKey,
      },
    });
  }
}
