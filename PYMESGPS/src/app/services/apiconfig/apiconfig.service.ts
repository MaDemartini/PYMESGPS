import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {
  private baseUrl = environment.api_url;
  private androidMapApiKey = environment.androidApiKey; 
  private httpApiKey = environment.httpApiKey; 
  private mapaKey = environment.apikey3;


  constructor(private http: HttpClient) {}

  
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'apiKey': environment.apiKeySupabase,
      'Authorization': `Bearer ${environment.apiKeySupabase}`
    });
  }

  public getMapaApiKey(): string {
    return this.mapaKey;
  }

  public getMapaAndroidApiKey(): string {
    return this.androidMapApiKey;
  }

  public getHttpApiKey(): string{
    return this.httpApiKey;
  }

  // Método GET genérico que devuelve la respuesta completa usando HttpResponse
  public get<T>(path: string, options?: { params?: HttpParams }): Observable<HttpResponse<T>> {
    const url = `${this.baseUrl}/${path}`;
    return this.http.get<T>(url, { headers: this.getHeaders(), observe: 'response', ...options }).pipe(
      catchError(this.handleError)
    );
  }

  // Método POST genérico que devuelve la respuesta completa usando HttpResponse
  public post<T>(path: string, data: any, options?: { observe?: 'response' }): Observable<HttpResponse<T>> {
    const url = `${this.baseUrl}/${path}`;
    const headers = this.getHeaders().set('Prefer', 'return=representation');
    return this.http.post<T>(url, data, { headers, observe: 'response', ...options }).pipe(
      catchError(this.handleError)
    );
  }

  // Método PUT genérico que devuelve la respuesta completa usando HttpResponse
  public put<T>(path: string, data: any, options?: { observe?: 'response' }): Observable<HttpResponse<T>> {
    const url = `${this.baseUrl}/${path}`;
    console.log("URL generada para PUT:", url); // Verifica la URL aquí
    return this.http.put<T>(url, data, { headers: this.getHeaders(), observe: 'response', ...options }).pipe(
      catchError(this.handleError)
    );
  }
  
  public put1<T>(
    path: string,
    data: any,
    options?: { headers?: HttpHeaders; observe?: 'response' }
  ): Observable<HttpResponse<T>> {
    const url = `${this.baseUrl}/${path}`;
    const headers = options?.headers || this.getHeaders(); // Combinar headers si se proporcionan
    return this.http.put<T>(url, data, { headers, observe: 'response', ...options }).pipe(
      catchError(this.handleError) // Manejar errores correctamente
    );
  }  
  
  public createHeaders(extraHeaders: { [key: string]: string } = {}): HttpHeaders {
    let headers = this.getHeaders(); // Llama al método privado para obtener los headers base
    for (const [key, value] of Object.entries(extraHeaders)) {
      headers = headers.set(key, value);
    }
    return headers;
  }   

  public getBaseUrl(): string {
    return this.baseUrl;
  }  

  // Método DELETE genérico que devuelve la respuesta completa usando HttpResponse
  public delete<T>(path: string, options?: { observe?: 'response' }): Observable<HttpResponse<T>> {
    const url = `${this.baseUrl}/${path}`;
    return this.http.delete<T>(url, { headers: this.getHeaders(), observe: 'response', ...options }).pipe(
      catchError(this.handleError)
    );
  }

  // Método PATCH genérico que devuelve la respuesta completa usando HttpResponse
  public patch<T>(path: string, body: any, options?: { observe?: 'response' }): Observable<HttpResponse<T>> {
    const url = `${this.baseUrl}/${path}`;
    return this.http.patch<T>(url, body, { headers: this.getHeaders(), observe: 'response', ...options }).pipe(
      catchError(this.handleError)
    );
  }

  // Método centralizado para manejar errores
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error en la solicitud';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error del cliente: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Código de error ${error.status}: ${error.message}`;
    }
    console.error('Error ocurrido:', error);
    return throwError(() => new Error(errorMessage));
  }
}
