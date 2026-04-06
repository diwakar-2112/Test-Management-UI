import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { enviorment } from '../../../enviorments/environment';
export interface ApiRequestOptions {
  context?: HttpContext;
}

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    private http = inject(HttpClient);
    private baseUrl = enviorment.baseUrl;

    // Generic Get
    regularGetRequest<T>(path: string, params?: any,options?:ApiRequestOptions): Observable<T> {
        let httpParams = new HttpParams();
        if (params) {
            Object.keys(params).forEach((key) => {
                if (params[key] !== null && params[key] !== undefined) {
                    httpParams = httpParams.set(key, params[key]);
                }
            });
        }
        return this.http.get<T>(`${this.baseUrl}/${path}`, { params: httpParams,context:options?.context});
    }
    
  // Generic POST
  post<T>(path: string, body: any,options?:ApiRequestOptions): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${path}`, body,{context:options?.context});
  }

  // Generic PUT
  put<T>(path: string, body: any,options?:ApiRequestOptions): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${path}`, body,{context:options?.context});
  }

  // Generic DELETE
  delete<T>(path: string,options?:ApiRequestOptions): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${path}`,{context:options?.context});
  }
}