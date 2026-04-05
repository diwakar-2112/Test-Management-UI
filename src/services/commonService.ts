import { inject, Injectable } from '@angular/core';
import { ApiService } from '../app/core/services/api.service';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { User } from '../app/core/model/model';
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
        return this.api.regularGetRequest<any>(url, body).pipe(
            tap((res) => {
                if (res) {
                    console.log("test suites fetched successfully");
                }
            })
        )
    }
    deleteTestSuiteById(projectId: any, testSuiteId: any) {
        let url = `projects/${projectId}/testsuites/${testSuiteId}`;
        return this.api.delete<any>(url).pipe(
            tap((res) => {
                if (res) {
                    console.log("test suite deleted successfully");
                }
            })
        )
    }
    createTestSuite(projectId: string, body: any) {
        let url = `projects/${projectId}/testsuites`;
        return this.api.post<any>(url, body).pipe(
            tap((res) => {
                if (res) {
                    console.log("test suite created successfully");
                }
            }),
            catchError((err) => {
                console.log(err);
                return throwError(() => err);
            })
        )
    }
    getTestCases(projectId: string, testSuiteId: string, body: any) {
        let url = `testsuites/${testSuiteId}/testcase`;
        return this.api.regularGetRequest<any>(url, body).pipe(
            tap((res) => {
                if (res) {
                    console.log("test cases fetched successfully");
                }
            })
        )
    }
    deleteTestCaseById(testCaseId: number) {
        let url = `testcases/${testCaseId}`;
        return this.api.delete<any>(url).pipe(
            tap((res) => {
                if (res) {
                    console.log("test case deleted successfully");
                }
            })
        )
    }
    createTestCase(testSuiteId: string, body: object) {
        let url = `testsuites/${testSuiteId}/testcase`;
        return this.api.post<any>(url, body).pipe(
            tap((res) => {
                if (res) {
                    console.log("test case created successfully");
                }
            }),
            catchError((err) => {
                console.log(err);
                return throwError(() => err);
            })
        )
    }
    updateTestCase(testCaseId: number, body: object) {
        let url = `testcases/${testCaseId}`;
        return this.api.put<any>(url, body).pipe(
            tap((res) => {
                if (res) {
                    console.log('case updated');

                }
            }),
            catchError((err) => {
                return throwError(() => err)
            })
        )
    }

    getAllTestRuns(params: any): Observable<any> {
        return this.api.regularGetRequest<any>('testruns', params).pipe(
            tap((res) => {
                if (res) {
                    console.log("global test runs fetched successfully");
                }
            })
        );
    }
    addAssignee(testrunId: string, asigneeId: string) {
        let url = `testruns/${testrunId}/assign?userId=${asigneeId}`
        return this.api.post<any>(url, '').pipe(
            tap((res) => {
                console.log('assigned successfully');

            }),
            catchError((err) => {
                return throwError(() => err)
            })
        )
    }
    getAssigneeLookup() {
        let url = `users/lookup`;
        return this.api.regularGetRequest<User[]>(url).pipe(
            tap((res) => {
                console.log('fetched users list');
            }),
            catchError((err) => {
                return throwError(() => err)
            })
        )
    }
}