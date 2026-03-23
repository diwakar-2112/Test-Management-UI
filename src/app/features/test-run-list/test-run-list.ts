import { Component, ChangeDetectionStrategy, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonService } from '../../../services/commonService';
import { PageInfo, TestRun, Project } from '../../core/model/model';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ModalService } from '../../core/services/modal.service';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { PaginationComponent } from '../../core/components/pagination/pagination.component';

@Component({
    selector: 'app-test-run-list',
    standalone: true,
    imports: [CommonModule, RouterModule, ReactiveFormsModule, ToastModule, InputTextModule, SelectModule, PaginationComponent],
    providers: [MessageService],
    templateUrl: './test-run-list.html',
    styleUrl: './test-run-list.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestRunList implements OnInit {
    private router = inject(Router);
    private commonService = inject(CommonService);
    private messageService = inject(MessageService);
    private fb = inject(FormBuilder);

    testRuns = signal<TestRun[]>([]);
    projects = signal<Project[]>([]);
    pageInfo = signal<PageInfo | null>(null);
    loading = signal(false);
    errorMessage = signal('');

    currentPage = signal(0);
    pageSize = signal(10);

    statusOptions = [
        { label: 'All Statuses', value: null },
        { label: 'Not Started', value: 'NOT_STARTED' },
        { label: 'In Progress', value: 'IN_PROGRESS' },
        { label: 'Completed', value: 'COMPLETED' }
    ];

    filterForm = this.fb.group({
        search: [''],
        projectId: [null as number | null],
        status: [null as string | null]
    });

    totalPages = computed(() => this.pageInfo()?.totalPages ?? 0);
    totalElements = computed(() => this.pageInfo()?.totalElements ?? 0);

    ngOnInit() {
        this.loadProjects();
        this.getTestRuns();

        // Subscribe to filter changes to reload data
        this.filterForm.valueChanges.subscribe(() => {
            this.currentPage.set(0); // reset page on filter change
            this.getTestRuns();
        });
    }

    loadProjects() {
        this.commonService.getAllProjects(0, 1000).subscribe({
            next: (res: any) => {
                if (res && res.content) {
                    this.projects.set(res.content);
                }
            }
        });
    }

    getTestRuns() {

        this.loading.set(true);
        const filters = this.filterForm.value;
        const params: any = {
            page: this.currentPage(),
            size: this.pageSize()
        };

        if (filters.search) params.search = filters.search;
        if (filters.projectId) params.projectId = filters.projectId;
        if (filters.status) params.status = filters.status;

        this.commonService.getAllTestRuns(params).subscribe({
            next: (res: any) => {
                if (res) {
                    console.log(res, 'is res of testruns');

                    this.testRuns.set(res.content || []);
                    this.pageInfo.set(res.pageInfo || null);
                }
                this.loading.set(false);
            },
            error: (err) => {
                this.errorMessage.set(err.error?.message ?? 'Failed to fetch test runs');
                this.showError();
                this.loading.set(false);
            }
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
            case 'COMPLETED': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'IN_PROGRESS': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'NOT_STARTED': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
        }
    }

    getStatusLabel(status: string): string {
        switch (status) {
            case 'COMPLETED': return 'Completed';
            case 'IN_PROGRESS': return 'In Progress';
            case 'NOT_STARTED': return 'Not Started';
            default: return status || 'Unknown';
        }
    }

    openCreateModal() {
        this.messageService.add({
            severity: 'info',
            summary: 'Coming Soon',
            detail: 'Create Test Run modal will be implemented in the next step.',
        });
    }

    navigateToExecution(run: TestRun) {
        console.log('Navigate to run:', run);
    }
}
