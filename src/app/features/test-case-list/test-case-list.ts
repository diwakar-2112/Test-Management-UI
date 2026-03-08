import { Component, ChangeDetectionStrategy, computed, inject, input, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { TestCase, PageInfo } from '../../core/model/model';
import { CommonService } from '../../../services/commonService';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';


@Component({
    selector: 'app-test-case-list',
    imports: [CommonModule, RouterModule, FormsModule, DragDropModule, ToastModule],
    templateUrl: './test-case-list.html',
    styleUrl: './test-case-list.css',
    providers: [MessageService],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestCaseList implements OnInit {
    private router = inject(Router);
    private commonService = inject(CommonService);
    projectId = input.required<string>();
    suiteId = input.required<string>();
    private messageService = inject(MessageService);

    loading = signal(false);
    searchQuery = signal('');
    expandedIds = signal<Set<number>>(new Set());
    openMenuId = signal<number | null>(null);
    errorMessage = signal('');

    ngOnInit(): void {
        this.getTestCases();
    }
    showError() {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: this.errorMessage(), sticky: false });
    }

    // Dummy data
    testCases = signal<any[]>([
    ]);

    pageInfo = signal<PageInfo>({
        currentPage: 0,
        totalPages: 1,
        totalElements: 2,
        size: 10
    });

    totalElements = computed(() => this.pageInfo().totalElements);

    filteredTestCases = computed(() => {
        const query = this.searchQuery().toLowerCase().trim();
        if (!query) return this.testCases();
        return this.testCases().filter(tc =>
            tc.title.toLowerCase().includes(query)
        );
    });

    toggleExpand(id: number) {
        this.expandedIds.update(set => {
            const next = new Set(set);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    }

    toggleMenu(id: number) {
        this.openMenuId.update(current => current === id ? null : id);
    }

    closeMenu() {
        this.openMenuId.set(null);
    }
    editMenu(id: number) {
        this.openMenuId.set(null);
    }
    deleteMenu(id: any) {
        console.log(id, 'delte');
        this.commonService.deleteTestCaseById(id).subscribe({
            next: (res) => {
                console.log(res);
                this.getTestCases();
                this.messageService.add({
                    severity: 'error',
                    summary: 'Deleted',
                    detail: `Deleted Successfully`,
                })
            },
            error: (err) => {
                console.log(err);
                this.errorMessage.set(err.error.message)
                this.showError();
            }
        })
        this.openMenuId.set(null);
    }
    isExpanded(id: number): boolean {
        return this.expandedIds().has(id);
    }

    onDrop(event: CdkDragDrop<TestCase[]>) {
        this.testCases.update(items => {
            const copy = [...items];
            moveItemInArray(copy, event.previousIndex, event.currentIndex);
            return copy;
        });
    }

    onSearch(value: string) {
        this.searchQuery.set(value);
    }

    navigateBack() {
        this.router.navigate(['/projects', this.projectId(), 'test-suites']);
    }

    navigateToProject() {
        this.router.navigate(['/projects', this.projectId()]);
    }

    getTestCases() {
        this.loading.set(true);
        this.commonService.getTestCases(this.projectId(), this.suiteId(), {}).subscribe({
            next: (res) => {
                this.testCases.set(res.content);
                this.pageInfo.set(res.pageInfo);
                this.loading.set(false);
            },
            error: (err) => {
                console.log(err);
                this.loading.set(false);
            }
        })
    }
}
