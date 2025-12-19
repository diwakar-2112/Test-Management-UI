import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../../../services/project.service';
//mat imports
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
// 
import { ProjectList } from '../projects/project-list/project-list';
import { ThemeService } from '../../../services/theme.service.ts';
@Component({
  selector: 'app-dashboard',
  imports: [MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,ProjectList],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private projectService = inject(ProjectService);
  themeService = inject(ThemeService);

  toggleTheme() {
    this.themeService.toggleTheme();
  }
  ngOnInit(): void {
    this.goToProject();
  }
  private router = inject(Router);
  projectCount=signal(0);
  userName=signal('');
  initials = computed(() => {
    const name = this.userName();
  const parts = name.split(' ');
  return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
});
  goToProject(){
    this.projectService.getAllProjects(0,10).subscribe({
      next:(res=>{
        console.log(res);
        this.userName.set(localStorage?.getItem('userName')??'');
        this.projectCount.set(res?.content?.length);
      }),
      error:(err=>{

      })
    })
    // this.router.navigate(['/projects'])
  }
}
