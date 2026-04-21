import { Component, ChangeDetectionStrategy, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

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

  testRun = signal<any>(null);
  loading = signal<boolean>(false);
  
  // Dummy data just for visualization, to be replaced by API call later
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const runId = params.get('runId');
      this.getTestRunDetails(Number(runId));
    });
  }

  getTestRunDetails(runId: number) {
    this.loading.set(true);
    // Simulate getting data without timeout delays (user specifically said no timeout for lagging UI)
    const dummyData = {
      id: runId || 57,
      name: "Gaming Test Run",
      status: "NOT_STARTED",
      createdAt: "2026-04-17T16:19:34.763658",
      projectId: 1,
      assignee: {
        id: 3,
        username: "dev.diwakar"
      },
      testResults: [
        {
          id: 257,
          status: "NOT_RUN",
          comments: null,
          title: "V1 Testing",
          description: "V1 Testing",
          steps: "Step1",
          expectedResult: "expected result"
        },
        {
          id: 258,
          status: "NOT_RUN",
          comments: null,
          title: "v1 2nd testcase",
          description: "This is v1 2nd testcase",
          steps: "These are the steps",
          expectedResult: "These are the expected results."
        }
      ]
    };
    
    this.testRun.set(dummyData);
    this.loading.set(false);
  }

  updateTestStatus(testId: number, status: string) {
    // Dummy update without transition
    const currentData = this.testRun();
    if (currentData) {
      const updatedResults = currentData.testResults.map((tr: any) => {
        if (tr.id === testId) {
          return { ...tr, status: status };
        }
        return tr;
      });
      this.testRun.set({ ...currentData, testResults: updatedResults });
    }
  }

  getStatusBadgeClass(status: string): string {
    switch(status) {
      case 'PASSED': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800';
      case 'FAILED': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800';
      case 'NOT_RUN': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700';
      case 'NOT_STARTED': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700';
    }
  }
}
