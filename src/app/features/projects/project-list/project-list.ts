// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-project-list',
//   imports: [],
//   templateUrl: './project-list.html',
//   styleUrl: './project-list.css',
// })
// export class ProjectList {

// }
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ProjectService } from '../../../../services/project.service';
@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule],
  template: `
    <div class="card p-4">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">Projects</h2>
      </div>

      <!-- [value] expects an array. Since 'projects' is a signal holding any[], we call projects() -->
      <p-table 
        [value]="projects()" 
        [paginator]="true" 
        [rows]="10" 
        [lazy]="true" 
        (onLazyLoad)="loadProjects($event)"
        [totalRecords]="totalRecords()"
        [loading]="loading()"
        styleClass="p-datatable-sm">
        
        <ng-template pTemplate="header">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </ng-template>

        <!-- Since it's 'any', Angular won't complain about .name or .description -->
        <ng-template pTemplate="body" let-project>
          <tr>
            <td>{{ project.id }}</td>
            <td>{{ project.name }}</td>
            <td>{{ project.description }}</td>
            <td>
              <p-button icon="pi pi-pencil" [text]="true" severity="info"></p-button>
              <p-button icon="pi pi-trash" [text]="true" severity="danger"></p-button>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  `
})
export class ProjectList implements OnInit {
  private projectService = inject(ProjectService);

  // CHANGED: Typed as any[]
  projects = signal<any[]>([]);
  totalRecords = signal<number>(0);
  loading = signal<boolean>(true);

  ngOnInit() {
    // Lazy load handles the first call
  }

  loadProjects(event: any) {
    this.loading.set(true);
    const page = event.first / event.rows;
    const size = event.rows;

    this.projectService.getAllProjects(page, size).subscribe({
      next: (response) => {
        // response is 'any', so we access .content directly
        this.projects.set(response.content); 
        this.totalRecords.set(response.totalElements);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error:', err);
        this.loading.set(false);
      }
    });
  }

  // createProject() {
  //   // Example of sending 'any' object
  //   const newProj = { name: 'Demo Project', description: 'Created from FE' };
    
  //   this.projectService.createProject(newProj).subscribe(res => {
  //       console.log('Created:', res);
  //       // Reload list...
  //       this.loadProjects({ first: 0, rows: 10 });
  //   });
  // }
}