import { Component, ChangeDetectionStrategy, inject, OnInit, Signal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../../../services/project.service';
import { Project, ProjectListResponse } from '../../../core/model/model';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
// 

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [
    CommonModule,TooltipModule
  ],
  templateUrl: './project-list.html',
  styleUrl: './project-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectList implements OnInit {
  ngOnInit(): void {
    this.getProjects();
  }
  commonService=inject(ProjectService);
  products= signal<Project[]>([]);

  getProjects(){
    this.commonService.getAllProjects(0,10).subscribe({
      next:(res:ProjectListResponse)=>{
        this.products.set(res.content);
        console.log(this.products);
        
      }
    })
  }
}
