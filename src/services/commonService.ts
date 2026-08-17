import { inject, Injectable } from '@angular/core';
import { ApiService } from '../app/core/services/api.service';
import { catchError, Observable, tap, throwError } from 'rxjs';
import {
  ModuleRequest,
  ModuleResponse,
  RoleAccess,
  RoleAccessPayload,
  RoleAccessResponse,
  User,
  UserPayload,
} from '../app/core/model/model';
import { UserListResponse } from '../app/core/model/model';
export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  userName: string;
  role: string;
}
@Injectable({
  providedIn: 'root',
})
export class CommonService {
  private api = inject(ApiService);
  getAllProjects(page: number, size: number, isAll: boolean): Observable<any> {
    return this.api.regularGetRequest<any>('projects', { page, size, isAll });
  }
  getProjectById(id: any) {
    return this.api.regularGetRequest<any>(`projects/${id}`);
  }

  login(body: any): Observable<any> {
    return this.api.post<LoginResponse>('auth/login', body).pipe(
      tap((response) => {
        if (response && response.accessToken) {
          localStorage.setItem('userName', response.userName);
          localStorage.setItem('token', response.accessToken);
        }
      }),
    );
  }
  googleAuthLogin(idToken: any) {
    let url = `auth/google`;
    return this.api.post<any>(url, { idToken: idToken }).pipe(
      tap((response) => {
        if (response && response.accessToken) {
          localStorage.setItem('userName', response.userName);
          localStorage.setItem('token', response.accessToken);
        }
      }),
    );
  }
  register(body: any): Observable<any> {
    return this.api.post<any>('auth/register', body).pipe(
      tap((response) => {
        if (response) {
          console.log('register success');
        }
      }),
    );
  }
  createProject(body: any): Observable<any> {
    return this.api.post<any>('projects', body).pipe(
      tap((response) => {
        if (response) {
          console.log('project created successfully');
        }
      }),
    );
  }
  getTestSuites(projectId: any, body: any) {
    let url = `projects/${projectId}/testsuites`;
    return this.api.regularGetRequest<any>(url, body).pipe(
      tap((res) => {
        if (res) {
          console.log('test suites fetched successfully');
        }
      }),
    );
  }
  deleteTestSuiteById(projectId: any, testSuiteId: any) {
    let url = `projects/${projectId}/testsuites/${testSuiteId}`;
    return this.api.delete<any>(url).pipe(
      tap((res) => {
        if (res) {
          console.log('test suite deleted successfully');
        }
      }),
    );
  }
  createTestSuite(projectId: string, body: any) {
    let url = `projects/${projectId}/testsuites`;
    return this.api.post<any>(url, body).pipe(
      tap((res) => {
        if (res) {
          console.log('test suite created successfully');
        }
      }),
      catchError((err) => {
        console.log(err);
        return throwError(() => err);
      }),
    );
  }
  getTestCases(projectId: string, testSuiteId: string, body: any) {
    let url = `testsuites/${testSuiteId}/testcase`;
    return this.api.regularGetRequest<any>(url, body).pipe(
      tap((res) => {
        if (res) {
          console.log('test cases fetched successfully');
        }
      }),
    );
  }
  deleteTestCaseById(testCaseId: number) {
    let url = `testcases/${testCaseId}`;
    return this.api.delete<any>(url).pipe(
      tap((res) => {
        if (res) {
          console.log('test case deleted successfully');
        }
      }),
    );
  }
  createTestCase(testSuiteId: string, body: object) {
    let url = `testsuites/${testSuiteId}/testcase`;
    return this.api.post<any>(url, body).pipe(
      tap((res) => {
        if (res) {
          console.log('test case created successfully');
        }
      }),
      catchError((err) => {
        console.log(err);
        return throwError(() => err);
      }),
    );
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
        return throwError(() => err);
      }),
    );
  }

  getAllTestRuns(params: any): Observable<any> {
    return this.api.regularGetRequest<any>('testruns', params).pipe(
      tap((res) => {
        if (res) {
          console.log('global test runs fetched successfully');
        }
      }),
    );
  }
  addAssignee(testrunId: number, asigneeId: string) {
    let url = `testruns/${testrunId}/assign?userId=${asigneeId}`;
    return this.api.post<any>(url, '').pipe(
      tap((res) => {
        console.log('assigned successfully');
      }),
      catchError((err) => {
        return throwError(() => err);
      }),
    );
  }
  getAssigneeLookup() {
    let url = `users/lookup`;
    return this.api.regularGetRequest<User[]>(url).pipe(
      tap((res) => {
        console.log('fetched users list');
      }),
      catchError((err) => {
        return throwError(() => err);
      }),
    );
  }
  createTestRun(suiteId: string, body: object) {
    let url = `testsuites/${suiteId}/testruns`;
    return this.api.post(url, body).pipe(
      tap((res) => {
        console.log('added run successfully');
      }),
      catchError((err) => {
        return throwError(() => err);
      }),
    );
  }
  getTestRunById(runId: string) {
    let url = `testruns/${runId}`;
    return this.api.regularGetRequest(url).pipe(
      tap((res) => {
        console.log('run fetch successfully');
      }),
      catchError((error) => {
        return throwError(() => error);
      }),
    );
  }
  updateTestRunStatus(body: object, resultId: any) {
    let url = `testruns/results/${resultId}`;
    return this.api.put(url, body).pipe(
      tap((res) => {
        console.log('run status updated');
      }),
      catchError((error) => {
        return throwError(() => error);
      }),
    );
  }

  getUserList(params?: any): Observable<UserListResponse> {
    let url = `admin/users`;
    return this.api.regularGetRequest<UserListResponse>(url, params).pipe(
      tap((res) => {
        console.log('fetched users list');
      }),
      catchError((err) => {
        return throwError(() => err);
      }),
    );
  }
  createUser(body: UserPayload): Observable<any> {
    let url = `admin/users`;
    return this.api.post<UserPayload>(url, body).pipe(
      tap((res) => {
        console.log('user created successfully');
      }),
      catchError((err) => {
        return throwError(() => err);
      }),
    );
  }
  updateUser(userId: number, body: any): Observable<any> {
    let url = `admin/users/${userId}`;
    return this.api.put<any>(url, body).pipe(
      tap((res) => {
        console.log('user updated successfully');
      }),
      catchError((err) => {
        return throwError(() => err);
      }),
    );
  }
  getModules(): Observable<ModuleResponse[]> {
    let url = `admin/modules`;
    return this.api.regularGetRequest<ModuleResponse[]>(url).pipe(
      tap((res) => {
        console.log('fetched modules list');
      }),
      catchError((err) => {
        return throwError(() => err);
      }),
    );
  }
  createModule(body: ModuleRequest): Observable<ModuleRequest> {
    let url = `admin/modules`;
    return this.api.post<ModuleRequest>(url, body).pipe(
      tap((res) => {
        console.log('module created successfully');
      }),
      catchError((err) => {
        return throwError(() => err);
      }),
    );
  }
  getRoles() {
    let url = `admin/roles`;
    return this.api.regularGetRequest<RoleAccessResponse>(url).pipe(
      tap((res) => {
        console.log('fetched roles list');
      }),
      catchError((err) => {
        return throwError(() => err);
      }),
    );
  }
  getRoleById(id?: number) {
    let url = `admin/roles/${id}`;
    return this.api.regularGetRequest<any>(url).pipe(
      tap((res) => {
        console.log('fetched roles list');
      }),
      catchError((err) => {
        return throwError(() => err);
      }),
    );
  }
  createRole(body: RoleAccessPayload) {
    let url = `admin/roles`;
    return this.api.post<RoleAccessResponse>(url, body).pipe(
      tap((res) => {
        console.log('created roles');
      }),
      catchError((err) => {
        return throwError(() => err);
      }),
    );
  }
  updateRole(body: RoleAccessPayload, id: number) {
    let url = `admin/roles/${id}`;
    return this.api.put(url, body).pipe(
      tap((res) => {
        console.log('role updated');
      }),
      catchError((err) => {
        return throwError(() => err);
      }),
    );
  }
}
