import {
  Component,
  ChangeDetectionStrategy,
  computed,
  inject,
  OnInit,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonService } from '../../../services/commonService';
import { PageInfo, TestRun, Project } from '../../core/model/model';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ModalService } from '../../core/services/modal.service';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { PaginationComponent } from '../../core/components/pagination/pagination.component';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { User } from '../../core/model/model';
import { GlobalLoaderService } from '../../core/services/global-loader.service';



@Component({
  selector: 'app-test-run-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ToastModule,
    InputTextModule,
    SelectModule,
    PaginationComponent,
    FloatLabelModule,
    FormsModule,
  ],
  providers: [MessageService],
  templateUrl: './test-run-list.html',
  styleUrl: './test-run-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestRunList implements OnInit {
  private globalLoader = inject(GlobalLoaderService);
  private router = inject(Router);
  private commonService = inject(CommonService);
  private messageService = inject(MessageService);
  private modalService = inject(ModalService);
  private fb = inject(FormBuilder);

  testRuns = signal<TestRun[]>([]);
  projects = signal<Project[]>([]);
  pageInfo = signal<PageInfo | null>(null);
  loading = signal(false);
  errorMessage = signal('');
  //   isSuiteDisabled = signal<boolean>(true);

  currentPage = signal(0);
  pageSize = signal(10);
  isAssigneeFormSubmitted = signal(false);
  isCreateRunFormSubmitted = signal(false);
  selectedRunForAssignee = signal<TestRun | null>(null);

  addAssigneeModal = viewChild.required<TemplateRef<unknown>>('addAssigneeModal');
  createTestRunModal = viewChild.required<TemplateRef<unknown>>('createTestRunModal');
  users: User[] | undefined;
  statusOptions = [
    { label: 'All Statuses', value: null },
    { label: 'Not Started', value: 'NOT_STARTED' },
    { label: 'In Progress', value: 'IN_PROGRESS' },
    { label: 'Completed', value: 'COMPLETED' },
  ];
  createSuiteOptions: any[] = [];

  filterForm = this.fb.group({
    search: [''],
    projectId: [null as number | null],
    status: [null as string | null],
  });

  addAssigneeForm = this.fb.group({
    userName: ['', [Validators.required]],
  });
  createTestRunForm = this.fb.group({
    name: ['', [Validators.required]],
    project: ['', [Validators.required]],
    suite: [{ value: '', disabled: true }, [Validators.required]],
  });

  totalPages = computed(() => this.pageInfo()?.totalPages ?? 0);
  totalElements = computed(() => this.pageInfo()?.totalElements ?? 0);

  ngOnInit() {
    this.loadProjects();
    this.getAssigneeLookup();
    this.getTestRuns();
    this.filterForm.valueChanges.subscribe(() => {
      this.currentPage.set(0);
      this.getTestRuns();
    });
  }

  loadProjects() {
    this.commonService.getAllProjects(0, 1000).subscribe({
      next: (res: any) => {
        if (res && res.content) {
          this.projects.set(res.content);
        }
      },
    });
  }

  getTestRuns() {
    this.loading.set(true);
    const filters = this.filterForm.value;
    const params: any = {
      page: this.currentPage(),
      size: this.pageSize(),
    };

    if (filters.search) params.search = filters.search;
    if (filters.projectId) params.projectId = filters.projectId;
    if (filters.status) params.status = filters.status;

    this.commonService.getAllTestRuns(params).subscribe({
      next: (res: any) => {
        if (res) {
          this.testRuns.set(res.content || []);
          this.pageInfo.set(res.pageInfo || null);
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message ?? 'Failed to fetch test runs');
        this.showError();
        this.loading.set(false);
      },
    });
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    this.getTestRuns();
  }

  showError() {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: this.errorMessage(),
    });
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  formatTime(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'COMPLETED':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'IN_PROGRESS':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'NOT_STARTED':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'COMPLETED':
        return 'Completed';
      case 'IN_PROGRESS':
        return 'In Progress';
      case 'NOT_STARTED':
        return 'Not Started';
      default:
        return status || 'Unknown';
    }
  }

  openCreateModal() {
    this.isCreateRunFormSubmitted.set(false);
    this.createTestRunForm.reset({
      name: '',
      project: null,
      suite: null,
    });
    this.modalService.open(this.createTestRunModal(), {
      header: 'Create Test Run',
      width: '34rem',
    });
  }

  submitCreateTestRun() {
    this.isCreateRunFormSubmitted.set(true);
    if (this.createTestRunForm.invalid) {
      return;
    }

    let body = {
      name: this.createTestRunForm.getRawValue().name,
    };
    this.commonService
      .createTestRun(this.createTestRunForm.getRawValue()?.suite as string, body)
      .subscribe({
        next: (res:any) => {
          this.messageService.add({
            severity: 'success',
            summary: `Test Run ${res?.name} added successfully`
          });
          this.getTestRuns();
        },
        error: (err) => {},
      });

    this.closeCreateModal();
  }

  closeCreateModal() {
    this.createTestRunForm.reset({
      name: '',
      project: null,
      suite: null,
    });
    this.isCreateRunFormSubmitted.set(false);
    this.modalService.close();
  }

  navigateToExecution(run: TestRun) {
    event?.preventDefault();
  }

  assignUser(event: MouseEvent | KeyboardEvent, run: TestRun) {
    event.stopPropagation();
    event.preventDefault();
    this.selectedRunForAssignee.set(run);
    this.isAssigneeFormSubmitted.set(false);
    this.addAssigneeForm.reset();
    console.log(run);

    this.modalService.open(this.addAssigneeModal(), {
      header: 'Add Assignee',
      width: '30rem',
    });
  }

  submitAssignee() {
    this.isAssigneeFormSubmitted.set(true);
    if (this.addAssigneeForm.invalid) {
      return;
    }

    const run = this.selectedRunForAssignee();
    const userName = this.addAssigneeForm.get('userName')?.value;
    if (!run || !userName) {
      return;
    }

    console.log('Add assignee payload:', { testRunId: run.id, userName });
    this.commonService.addAssignee(run.id, userName).subscribe({
      next: (res: any) => {
        this.getTestRuns();
        this.closeAssigneeModal();
        this.messageService.add({
          severity: 'success',
          summary: `Test Run Assigned to user ${res?.assignee?.username}`,
          // detail: `Ready to assign user ${res?.assignee?.userName} to test run ${run.id}.`
        });
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message ?? 'Failed to assign test run');
        this.showError();
      },
    });
  }

  closeAssigneeModal() {
    this.addAssigneeForm.reset();
    this.isAssigneeFormSubmitted.set(false);
    this.selectedRunForAssignee.set(null);
    this.modalService.close();
  }

  getAssigneeLookup() {
    this.commonService.getAssigneeLookup().subscribe({
      next: (res: User[]) => {
        this.users = res;
        console.log(this.users, 'usrs');
      },
    });
  }
  onChange(event: any) {
    console.log(event.value, 'hello');
    this.commonService.getTestSuites(event?.value, { isAll: true }).subscribe({
      next: (res) => {
        console.log(res, 'res');
        this.createSuiteOptions = (res || []).map((elem: any) => ({
          label: elem.name,
          value: elem.id,
        }));
        this.createTestRunForm.get('suite')?.enable();
        // this.isSuiteDisabled.set(false);
      },
      error: (err) => {},
    });
  }
}
