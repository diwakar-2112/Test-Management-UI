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
  PASS:        { label: "PASS",        color: "#059669" }, // emerald-600
  FAIL:        { label: "FAIL",        color: "rgb(229 30 30)" }, // rose-600
  BLOCKED:     { label: "BLOCKED",     color: "#d97706" }, // amber-600
  IN_PROGRESS: { label: "IN_PROGRESS", color: "#0284c7" }, // sky-600
  SKIPPED:     { label: "SKIPPED",     color: "#64748b" }, // slate-500
  NOT_RUN:     { label: "NOT_RUN",     color: "#71717a" }, // zinc-500
  NOT_STARTED: { label: "NOT_STARTED", color: "#f59e0b" }, // amber-500
} as const;