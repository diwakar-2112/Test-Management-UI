import { inject, Injectable } from '@angular/core';
import { ApiService } from '../app/core/services/api.service';
import { Observable, tap } from 'rxjs';
export interface LoginResponse {
    accessToken: string;
    tokenType: string;
    userName: string; // <--- ADD THIS
    role: string;     // <--- ADD THIS
}
@Injectable({
    providedIn: 'root'
})


export class ProjectService {
    private api = inject(ApiService);
    getAllProjects(page: number = 0, size: number = 10): Observable<any> {
        return this.api.regularGetRequest<any>('projects', { page, size });
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
    createProject(body:any):Observable<any>{
        return this.api.post<any>('projects',body).pipe(
            tap((response)=>{
                if(response){
                    console.log("project created successfully");
                    
                }
            })
        )
    }

}