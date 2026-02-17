import { Component, ChangeDetectionStrategy, inject, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CommonService } from '../../../services/commonService';

@Component({
    selector: 'app-test-suite-list',
    imports: [CommonModule, RouterModule],
    templateUrl: './test-suite-list.html',
    styleUrl: './test-suite-list.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestSuiteList implements OnInit {
    private router = inject(Router);
    private commonService = inject(CommonService);

    projectId = input.required<string>();

    ngOnInit() {
        console.log('Test Suite List for project:', this.projectId());
        this.getTestSuites();
    }

    getTestSuites() {
        this.commonService.getTestSuites(this.projectId(), { page: 0, size: 10 }).subscribe({
            next: (res) => {
                if (res) {
                    console.log("test suites fetched successfully");
                    console.log(res);

                }
            },
            error: (err) => {
                console.log(err.error.message);
            }
        })
    }

    navigateBack() {
        this.router.navigate(['/projects', this.projectId()]);
    }
}
