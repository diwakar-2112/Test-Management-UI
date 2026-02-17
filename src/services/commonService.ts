import { inject, Injectable } from '@angular/core';
import { ApiService } from '../app/core/services/api.service';
import { Observable, tap } from 'rxjs';
import { HttpParams } from '@angular/common/http';
export interface LoginResponse {
    accessToken: string;
    tokenType: string;
    userName: string; // <--- ADD THIS
    role: string;     // <--- ADD THIS
}
@Injectable({
    providedIn: 'root'
})


export class CommonService {
    private api = inject(ApiService);
    getAllProjects(page: number = 0, size: number = 10): Observable<any> {
        return this.api.regularGetRequest<any>('projects', { page, size });
    }
    getProjectById(id: any) {
        return this.api.regularGetRequest<any>(`projects/${id}`);
    }

    login(body: any): Observable<any> {
        return this.api.post<LoginResponse>('auth/login', body).pipe(
            tap((response) => {
                if (response && response.accessToken) {
                    localStorage.setItem('userName', response.userName)
                    localStorage.setItem('token', response.accessToken);
                }
            })
        )
    }
    register(body: any): Observable<any> {
        return this.api.post<any>('auth/register', body).pipe(
            tap((response) => {
                if (response) {
                    console.log("register success");

                }
            })
        )
    }
    createProject(body: any): Observable<any> {
        return this.api.post<any>('projects', body).pipe(
            tap((response) => {
                if (response) {
                    console.log("project created successfully");

                }
            })
        )
    }
    getTestSuites(projectId: any, body: any) {
        let url = `projects/${projectId}/testsuites`;
        let params = new HttpParams();

        if (body.page !== undefined) {
            params = params.set('page', body.page);
        }

        if (body.size !== undefined) {
            params = params.set('size', body.size);
        }

        return this.api.regularGetRequest<any>(url, { params }).pipe(
            tap((res) => {
                if (res) {
                    console.log("test suites fetched successfully");
                }
            })
        )
    }

}