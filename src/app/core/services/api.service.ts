import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { enviorment } from '../../../enviorments/environment';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    private http = inject(HttpClient);
    private baseUrl = enviorment.baseUrl;

    // Generic Get
    regularGetRequest<T>(path: string, params?: any): Observable<T> {
        let httpParams = new HttpParams();
        if (params) {
            Object.keys(params).forEach((key) => {
                if (params[key] !== null && params[key] !== undefined) {
                    httpParams = httpParams.set(key, params[key]);
                }
            });
        }
        return this.http.get<T>(`${this.baseUrl}/${path}`, { params: httpParams });
    }
    
  // Generic POST
  post<T>(path: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${path}`, body);
  }

  // Generic PUT
  put<T>(path: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${path}`, body);
  }

  // Generic DELETE
  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${path}`);
  }
}