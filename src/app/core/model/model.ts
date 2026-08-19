export interface Project {
  id: number;
  name: string;
  description: string;
  testSuiteCount: number;
  testCaseCount: number;
  testRunCount: number;
}

export interface PageInfo {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  size: number;
}
export interface ProjectListResponse {
  content: Project[];
  pageInfo: PageInfo;
}

export interface TestSuite {
  id: number;
  name: string;
  projectId: number;
  createdAt: string;
  updatedAt: string;
}

export interface TestSuiteListResponse {
  content: TestSuite[];
  pageInfo: PageInfo;
}

export interface TestCase {
  id: number;
  title: string;
  description: string;
  steps: string;
  expectedResult: string;
  testSuitId: number;
}

export interface TestCaseListResponse {
  content: TestCase[];
  pageInfo: PageInfo;
}

export interface Assignee {
  id: number;
  username: string;
}

export interface TestResult {
  id: number;
  status: string;
  comments: string | null;
  title: string;
  description: string;
  steps: string;
  expectedResult: string;
}

export interface TestRun {
  id: number;
  name: string;
  status: string;
  createdAt: string;
  projectId: number;
  assignee: Assignee | null;
  testResults: TestResult[];
}

export interface TestRunListResponse {
  content: TestRun[];
  pageInfo: PageInfo;
}

export interface User {
  id: number;
  username: string;
}
export const Status = {
  PASS: { label: 'PASS', color: '#059669' }, // emerald-600
  FAIL: { label: 'FAIL', color: 'rgb(229 30 30)' }, // rose-600
  BLOCKED: { label: 'BLOCKED', color: '#d97706' }, // amber-600
  IN_PROGRESS: { label: 'IN_PROGRESS', color: '#0284c7' }, // sky-600
  SKIPPED: { label: 'SKIPPED', color: '#64748b' }, // slate-500
  NOT_RUN: { label: 'NOT_RUN', color: '#71717a' }, // zinc-500
  NOT_STARTED: { label: 'NOT_STARTED', color: '#f59e0b' }, // amber-500
} as const;

export interface UserList {
  id: number;
  username: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  mobile: string;
  status: string;
  roleId: number;
  roleName: string;
}
export interface UserListResponse {
  content: UserList[];
  pageInfo: PageInfo;
}
export interface UserPayload {
  username: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
  status: 'ACTIVE' | 'INACTIVE';
  roleId: number;
}

export interface ModuleRequest {
  moduleName: string;
  moduleUrl: string;
  moduleKey: string;
}

export interface ModuleResponse extends ModuleRequest {
  moduleId: number;
}

export interface ModuleListResponse {
  content: ModuleResponse[];
  // pageInfo: PageInfo;
}

export interface ModuleAccess {
  moduleId: number;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canList: boolean;
  canView: boolean;
}

export interface RoleAccessPayload {
  roleName: string;
  moduleAccess: ModuleAccess[];
}
export interface RoleAccess extends RoleAccessPayload {
  roleId: number;
}

export type RoleAccessResponse = RoleAccess[];

export type AuthPermissions = [];
