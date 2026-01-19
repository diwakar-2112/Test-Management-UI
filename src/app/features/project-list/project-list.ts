import { Component, ChangeDetectionStrategy, inject, OnInit, Signal, signal, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../../services/project.service';
import { Project, ProjectListResponse } from '../../core/model/model';
import { TooltipModule } from 'primeng/tooltip';
import { ModalService } from '../../core/services/modal.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { Router } from '@angular/router';



@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [
    CommonModule, TooltipModule, ReactiveFormsModule, ButtonModule, InputTextModule, TextareaModule
  ],
  templateUrl: './project-list.html',
  styleUrl: './project-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectList implements OnInit {
  ngOnInit(): void {
    this.getProjects();
  }
  commonService = inject(ProjectService);
  modalService = inject(ModalService);
  router = inject(Router);
  fb = inject(FormBuilder);
  products = signal<Project[]>([]);

  projectForm = this.fb.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.required]]
  });

  getProjects() {
    this.commonService.getAllProjects(0, 10).subscribe({
      next: (res: ProjectListResponse) => {
        this.products.set(res.content);
        console.log(this.products);

      }
    })
  }

  openNewProject(template: TemplateRef<any>) {
    this.modalService.open(template, {
      header: 'Create New Project',
      width: '30rem' // Equivalent to the 25rem/30rem you might want
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
          if(res){
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
openProject(){
  // this.router.navigateByUrl()
}
}
