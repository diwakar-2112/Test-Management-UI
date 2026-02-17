import { Component, ChangeDetectionStrategy, inject, OnInit, Signal, signal, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonService } from '../../../services/commonService';
import { Project, ProjectListResponse } from '../../core/model/model';
import { TooltipModule } from 'primeng/tooltip';
import { ModalService } from '../../core/services/modal.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { Router } from '@angular/router';
import { CommonDataService } from '../../../services/commonDataService';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [
    CommonModule, TooltipModule, ReactiveFormsModule, ButtonModule, InputTextModule, TextareaModule,ToastModule,RippleModule
  ],
  templateUrl: './project-list.html',
  styleUrl: './project-list.css',
  providers:[MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectList implements OnInit {
  ngOnInit(): void {
    this.getProjects();
  }
   private messageService = inject(MessageService);
  commonService = inject(CommonService);
  commonDataService = inject(CommonDataService);
  modalService = inject(ModalService);
  router = inject(Router);
  fb = inject(FormBuilder);
  products = signal<Project[]>([]);

  projectForm = this.fb.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.required]]
  });
  showError() {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: this.errorMessage(),sticky: false  });
    }
  errorMessage=signal('');

  getProjects() {
    this.commonService.getAllProjects(0, 10).subscribe({
      next: (res: ProjectListResponse) => {
        this.products.set(res.content);
        this.commonDataService.projectData = res.content;

      }
    })
  }

  openNewProject(template: TemplateRef<any>) {
    this.modalService.open(template, {
      header: 'Create New Project',
      width: '30rem'
    }).onClose.subscribe((result) => {
      if (result) {
        console.log('Got result', result);
      }
      this.projectForm.reset();
    });
  }

  onSubmit() {
    if (this.projectForm.valid) {
      let body = {};
      body = {
        "name": this.projectForm.controls.name.value,
        "description": this.projectForm.controls.description.value
      }
      this.commonService.createProject(body).subscribe({
        next: (res) => {
          if (res) {
            this.getProjects();
          }

        },
        error: (error) => {

        }
      })
      this.modalService.close(this.projectForm.value);
    }
  }

  onCancel() {
    this.modalService.close();
  }
  openProject(id: number | string) {
    this.commonService.getProjectById(id).subscribe({
      next: (res) => {
        if (res) {
          this.router.navigate(['/projects', id]);
        }
      },
      error: (err) => {
        console.log(err.error.message);
        this.errorMessage.set(err.error.message)
        this.showError();
      }
    })
    
  }
}

