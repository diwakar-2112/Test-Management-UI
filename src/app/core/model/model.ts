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
