import { Component, ChangeDetectionStrategy, computed, inject, input, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { TestCase, PageInfo } from '../../core/model/model';
import { CommonService } from '../../../services/commonService';

@Component({
    selector: 'app-test-case-list',
    imports: [CommonModule, RouterModule, FormsModule, DragDropModule],
    templateUrl: './test-case-list.html',
    styleUrl: './test-case-list.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestCaseList implements OnInit {
    private router = inject(Router);
    private commonService = inject(CommonService);
    projectId = input.required<string>();
    suiteId = input.required<string>();

    loading = signal(false);
    searchQuery = signal('');
    expandedIds = signal<Set<number>>(new Set());


    ngOnInit(): void {
        this.getTestCases();
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
