import { Component, ChangeDetectionStrategy, EventEmitter, Output, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-pagination',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './pagination.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
    currentPage = input.required<number>();
    totalPages = input.required<number>();
    totalElements = input.required<number>();
    pageSize = input.required<number>();
    itemLabel = input<string>('items');

    @Output() pageChange = new EventEmitter<number>();

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
        for (let i = start; i <= end; i++) {
            if (i !== 0 && i !== total - 1) { // avoid duplicate first/last
                 pages.push(i);
            }
        }

        if (current < total - 3) pages.push(-1); // ellipsis

        // Always show last page
        if (total - 1 !== 0) {
            pages.push(total - 1);
        }

        return pages;
    });

    goToPage(page: number) {
        if (page < 0 || page >= this.totalPages() || page === this.currentPage()) return;
        this.pageChange.emit(page);
    }
}
