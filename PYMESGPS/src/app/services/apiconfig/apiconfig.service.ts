import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {
  private baseUrl = environment.api_url;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'apiKey': environment.apiKeySupabase,
      'Authorization': `Bearer ${environment.apiKeySupabase}`
    });
  }

  public get<T>(path: string, options?: { params?: HttpParams }): Observable<T> {
    const url = `${this.baseUrl}/${path}`;
    return this.http.get<T>(url, { headers: this.getHeaders(), ...options }).pipe(
      catchError(this.handleError)
    );
  }

  public post<T>(path: string, data: any): Observable<T> {
    const url = `${this.baseUrl}/${path}`;
    return this.http.post<T>(url, data, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  public put<T>(path: string, data: any): Observable<T> {
    const url = `${this.baseUrl}/${path}`;
    return this.http.put<T>(url, data, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  public delete<T>(path: string): Observable<T> {
    const url = `${this.baseUrl}/${path}`;
    return this.http.delete<T>(url, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  patch<T>(path: string, body: any): Observable<T> {
    const url = `${this.baseUrl}/${path}`;
    return this.http.patch<T>(url, body, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }


  // Mantener handleError privado para no exponer la lógica de manejo de errores
  private handleError(error: HttpErrorResponse) {
    console.error('Error ocurrido:', error);
    return throwError(() => new Error('Ha ocurrido un error en la solicitud'));
  }
}

