import { Component, ChangeDetectionStrategy, computed, inject, input, OnInit, signal, TemplateRef, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CommonService } from '../../../services/commonService';
import { PageInfo, TestSuite, TestSuiteListResponse } from '../../core/model/model';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ExcelExportService } from '../../core/services/excel-export.service';
import { ModalService } from '../../core/services/modal.service';
import { DialogService } from 'primeng/dynamicdialog';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { switchMap, tap } from 'rxjs';

@Component({
    selector: 'app-test-suite-list',
    imports: [CommonModule, RouterModule, ToastModule, ReactiveFormsModule],
    providers: [MessageService, DialogService],
    templateUrl: './test-suite-list.html',
    styleUrl: './test-suite-list.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestSuiteList implements OnInit {
    private router = inject(Router);
    private commonService = inject(CommonService);
    private messageService = inject(MessageService);
    private excelExportService = inject(ExcelExportService);
    private modalService = inject(ModalService);
    private fb = inject(FormBuilder);

    projectId = input.required<string>();

    testSuites = signal<TestSuite[]>([]);
    testSuitesExportData = signal<TestSuite[]>([]);
    pageInfo = signal<PageInfo | null>(null);
    loading = signal(false);
    exporting = signal(false);
    errorMessage = signal('');
    suiteToDelete = signal<TestSuite | null>(null);

    deleteConfirmModal = viewChild.required<TemplateRef<unknown>>('deleteConfirmModal');
    createSuiteModal = viewChild.required<TemplateRef<unknown>>('createSuiteModal');

    createSuiteForm = this.fb.group({
        name: ['', Validators.required],
    });

    currentPage = signal(0);
    pageSize = signal(5);

    totalPages = computed(() => this.pageInfo()?.totalPages ?? 0);
    totalElements = computed(() => this.pageInfo()?.totalElements ?? 0);

    pages = computed(() => {
        const total = this.totalPages();
        const current = this.currentPage();
        const pages: number[] = [];

        if (total <= 7) {
            for (let i = 0; i < total; i++) pages.push(i);
            return pages;
        }

        // Always show first page
        pages.push(0);

        if (current > 2) pages.push(-1); // ellipsis

        const start = Math.max(1, current - 1);
        const end = Math.min(total - 2, current + 1);
        for (let i = start; i <= end; i++) pages.push(i);

        if (current < total - 3) pages.push(-1); // ellipsis

        // Always show last page
        pages.push(total - 1);

        return pages;
    });

    ngOnInit() {
        console.log('in');

        this.getTestSuites();
    }

    getTestSuites(isAll = false) {
        this.loading.set(true);
        this.commonService.getTestSuites(this.projectId(), {
            page: this.currentPage(),
            size: this.pageSize(),
            isAll: isAll
        }).subscribe({
            next: (res: any) => {
                if (res) {
                    if (isAll) {
                        // Export-all response is a flat array
                        this.testSuitesExportData.set(res);
                        console.log('res', res, 'and', this.testSuitesExportData());


                    } else {
                        // Paginated response has content + pageInfo
                        this.testSuites.set(res.content);
                        this.pageInfo.set(res.pageInfo);
                    }
                }
                this.loading.set(false);
            },
            error: (err) => {
                this.errorMessage.set(err.error?.message ?? 'Failed to fetch test suites');
                this.showError();
                this.loading.set(false);
            }
        });
    }

    goToPage(page: number) {
        if (page < 0 || page >= this.totalPages() || page === this.currentPage()) return;
        this.currentPage.set(page);
        this.getTestSuites();
    }

    showError() {
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: this.errorMessage(),
        });
    }

    navigateBack() {
        this.router.navigate(['/projects', this.projectId()]);
    }

    exportToExcel() {
        this.exporting.set(true);
        const columns = [
            { header: 'S.No', key: 'sno', },
            { header: 'ID', key: 'id', },
            { header: 'Suite Name', key: 'name', },
            { header: 'Project ID', key: 'projectId', },
            { header: 'Created At', key: 'createdAt', },
            { header: 'Updated At', key: 'updatedAt', },
        ];
        this.commonService.getTestSuites(this.projectId(), {
            page: 0,
            size: '',
            isAll: true
        }).pipe(
            switchMap((res: TestSuite[]) =>
                this.excelExportService.exportToExcel(
                    res,
                    columns,
                    `test-suites-project-${this.projectId()}`,
                    'Test Suites'
                ).pipe(
                    tap(() => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Exported',
                            detail: `${res.length} test suites exported successfully`,
                        })
                    })
                ))
        ).subscribe({
            complete: () => this.exporting.set(false),
            error: () => this.exporting.set(false)
        })

    }

    formatDate(dateStr: string): string {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    }

    formatTime(dateStr: string): string {
        const date = new Date(dateStr);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    confirmDelete(suite: TestSuite) {
        this.suiteToDelete.set(suite);
        this.modalService.open(this.deleteConfirmModal(), {
            header: 'Confirm Deletion',
            width: '420px',
        });
    }

    cancelDelete() {
        this.suiteToDelete.set(null);
        this.modalService.close();
    }

    onDeleteConfirmed() {
        const suite = this.suiteToDelete();
        if (!suite) return;
        this.commonService.deleteTestSuiteById(this.projectId(), suite.id).subscribe({
            next: (res: any) => {
                if (res) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Deleted',
                        detail: `${suite.name} deleted successfully`,
                    });
                    this.getTestSuites();
                }
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: err.error?.message ?? 'Failed to delete test suite',
                });
            }
        })
        this.suiteToDelete.set(null);
        this.modalService.close();
    }

    openCreateModal() {
        this.createSuiteForm.reset();
        this.modalService.open(this.createSuiteModal(), {
            header: 'Create Test Suite',
            width: '450px',
        });
    }

    cancelCreate() {
        this.modalService.close();
    }

    onCreateSuite() {
        if (this.createSuiteForm.invalid) return;
        let body = {
            name: this.createSuiteForm.get('name')?.value
        }

        this.commonService.createTestSuite(this.projectId(), body).subscribe({
            next: (res: any) => {
                if (res) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Created',
                        detail: `Test suite '${body.name}' created successfully`,
                    });
                    this.getTestSuites();
                }
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: err.error?.message ?? 'Failed to create test suite',
                });
            }
        })

        this.modalService.close();
    }
}
