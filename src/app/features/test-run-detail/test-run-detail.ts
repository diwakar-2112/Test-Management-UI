import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonService } from '../../../services/commonService';
import { Status } from '../../core/model/model';
@Component({
  selector: 'app-test-run-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './test-run-detail.html',
  styleUrl: './test-run-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestRunDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private commonService = inject(CommonService);
  testRunData = signal<any>(null);
  loading = signal<boolean>(false);
  showStatusModal = signal<boolean>(false);
  selectedTestId = signal<number | null>(null);
  selectedStatus = signal<'PASS' | 'FAIL'>('PASS');
  statusComment = signal<string>('');
  runId = signal<any>(null);
  status = Status;
  
  // Dummy data just for visualization, to be replaced by API call later
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const runId = params.get('runId');
      console.log(typeof runId,'runId');
      this.runId.set(String(runId));
      this.getTestRunDetails(String(runId));
    });
  }

  getTestRunDetails(runId: string) {
    this.loading.set(true);
    this.commonService.getTestRunById(runId).subscribe({
      next:(res)=>{
        this.testRunData.set(res);
        console.log(this.testRunData(),'res testdata');
        this.loading.set(false);
      },
      error:(err)=>{
        console.log(err);
        this.loading.set(false);
      }
    })
  }

  openStatusModal(testId: number, currentStatus: string) {
    this.selectedTestId.set(testId);
    this.selectedStatus.set(currentStatus === 'FAIL' ? 'FAIL' : 'PASS');
    this.statusComment.set('');
    this.showStatusModal.set(true);
  }

  closeStatusModal() {
    this.showStatusModal.set(false);
    this.selectedTestId.set(null);
    this.statusComment.set('');
    this.selectedStatus.set('PASS');
  }

  setStatus(status: 'PASS' | 'FAIL') {
    this.selectedStatus.set(status);
  }

  onStatusCommentChange(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    this.statusComment.set(target.value);
  }

  submitStatusUpdate() {
    const testId = this.selectedTestId();
    if (testId === null) {
      return;
    }
    let body = {
      status:this.selectedStatus(),
      comment:this.statusComment()
    }
    this.commonService.updateTestRunStatus(body,this.selectedTestId()).subscribe({
      next:(res)=>{
        console.log(res,'res');
        this.getTestRunDetails(this.runId());
      },
      error:(err)=>{

      }
    })
    
    this.closeStatusModal();
  }

  getStatusBadgeClass(status: string): string {
    switch(status) {
      case 'PASS': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800';
      case 'FAIL': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800';
      case 'NOT_RUN': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700';
      case 'NOT_STARTED': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700';
    }
  }
  getStatus(status: any):any | null {
    console.log(status,'status');
    console.log(this.status[status as keyof typeof Status],'hel');
    
    return this.status[status as keyof typeof Status] ?? null;
  }
}
