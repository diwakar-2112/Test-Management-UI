import { Component, ChangeDetectionStrategy, computed, inject, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CommonService } from '../../../services/commonService';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Project } from '../../core/model/model';

@Component({
    selector: 'app-project-screen',
    imports: [CommonModule, ToastModule, RouterModule],
    providers: [MessageService],
    templateUrl: './project-screen.html',
    styleUrl: './project-screen.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectScreen implements OnInit {
    private messageService = inject(MessageService);
    private router = inject(Router);
    private commonService = inject(CommonService);

    projectId = input.required<string>();
    project = signal<Project | null>(null);
    errorMessage = signal('');

    displayId = computed(() => `Project ID: ${this.projectId()}`);

    ngOnInit() {
        this.getProjectById();
    }

    showError() {
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: this.errorMessage(),
        });
    }

    getProjectById() {
        const id = Number(this.projectId());
        this.commonService.getProjectById(id).subscribe({
            next: (res) => {
                if (res) {
                    this.project.set(res);
                }
            },
            error: (err) => {
                console.log(err.error.message);
                this.errorMessage.set(err.error.message);
                this.showError();
            },
        });
    }

    navigateToTestSuites() {
        this.router.navigate(['/projects', this.projectId(), 'test-suites']);
    }
}
