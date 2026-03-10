import {
  Component,
  ChangeDetectionStrategy,
  computed,
  inject,
  input,
  signal,
  OnInit,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { TestCase, PageInfo } from '../../core/model/model';
import { CommonService } from '../../../services/commonService';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ModalService } from '../../core/services/modal.service';
import { InputTextModule } from 'primeng/inputtext';

import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-test-case-list',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    ToastModule,
    InputTextModule,
  ],
  templateUrl: './test-case-list.html',
  styleUrl: './test-case-list.css',
  providers: [MessageService, DialogService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestCaseList implements OnInit {
  private router = inject(Router);
  private commonService = inject(CommonService);
  private modalService = inject(ModalService);
  private fb = inject(FormBuilder);
  projectId = input.required<string>();
  suiteId = input.required<string>();
  private messageService = inject(MessageService);

  loading = signal(false);
  searchQuery = signal('');
  expandedIds = signal<Set<number>>(new Set());
  openMenuId = signal<number | null>(null);
  errorMessage = signal('');
  isSubmitted = signal(false);
  editCase=signal(false);

  createTestCaseForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    steps: ['', Validators.required],
    expectedResult: ['', Validators.required],
  });

  createTestCaseModal = viewChild.required<TemplateRef<unknown>>('createTestCaseModal');

  ngOnInit(): void {
    this.getTestCases();
  }
  showError() {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: this.errorMessage(),
      sticky: false,
    });
  }

  // Dummy data
  testCases = signal<TestCase[]>([]);
  editCaseData = signal<TestCase | null>(null);
  pageInfo = signal<PageInfo>({
    currentPage: 0,
    totalPages: 1,
    totalElements: 2,
    size: 10,
  });

  totalElements = computed(() => this.pageInfo().totalElements);

  filteredTestCases = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.testCases();
    return this.testCases().filter((tc) => tc.title.toLowerCase().includes(query));
  });

  toggleExpand(id: number) {
    this.expandedIds.update((set) => {
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
    this.openMenuId.update((current) => (current === id ? null : id));
  }

  closeMenu() {
    this.openMenuId.set(null);
  }
  editMenu(testCase: TestCase) {
    this.editCase.set(true);
    this.openMenuId.set(null);
    
    this.editCaseData.set(testCase)
    this.createTestCaseForm.patchValue({
      title: testCase?.title,
      description: testCase?.description,
      steps: testCase?.steps,
      expectedResult: testCase?.expectedResult,
    });
    this.modalService.open(this.createTestCaseModal(), {
      header: 'Update Test Case',
      width: '600px',
    });

    
  }
  deleteMenu(id: number) {
    this.commonService.deleteTestCaseById(id).subscribe({
      next: (res) => {
        this.getTestCases();
        this.messageService.add({
          severity: 'error',
          summary: 'Deleted',
          detail: `Deleted Successfully`,
        });
      },
      error: (err) => {
        this.errorMessage.set(err.error.message);
        this.showError();
      },
    });
    this.openMenuId.set(null);
  }
  isExpanded(id: number): boolean {
    return this.expandedIds().has(id);
  }

  onDrop(event: CdkDragDrop<TestCase[]>) {
    this.testCases.update((items) => {
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
        this.loading.set(false);
      },
    });
  }
  createTestCase() {
    this.isSubmitted.set(false);
    this.createTestCaseForm.reset();
    this.modalService.open(this.createTestCaseModal(), {
      header: 'Create Test Case',
      width: '600px',
    });
  }

  onCreateTestCase() {
    this.isSubmitted.set(true);
    if (this.createTestCaseForm.invalid) {
      return;
    }
    const payload = this.createTestCaseForm.value;
    const editCase = this.editCaseData();
    const request = editCase?this.commonService.updateTestCase(editCase.id,payload):this.commonService.createTestCase(this.suiteId(),payload);

    request.subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Exported',
                 detail: editCase
          ? 'Test Case updated successfully'
          : 'Test Case created successfully',
        });
        this.editCase.set(false);
        this.editCaseData.set(null);
        this.getTestCases();
        this.closeModal();
      },
      error: (err) => {
        this.errorMessage.set(err.error.message);
        this.showError();
        this.closeModal();
      },
    });
    // Optional: Close modal after creation
    // this.closeModal();
  }
  closeModal() {
    this.modalService.close();
  }
}
