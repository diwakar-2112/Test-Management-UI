import { Component, computed, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../../../services/project.service';
import { ProjectList } from '../project-list/project-list';
// Material Imports
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../services/theme.service';
import { ProjectScreen } from '../project-screen/project-screen';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    ProjectList,
    ProjectScreen
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css', // Ensure styles.scss/css matches
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard implements OnInit {
  private projectService = inject(ProjectService);
  themeService = inject(ThemeService);
  // currentScreen=signal(true);

  // Mobile Sidebar State
  isMobileMenuOpen = signal(false);
  ngOnInit(): void {
    this.goToProject();
  }
  private router = inject(Router);
  projectCount = signal(0);
  userName = signal('');
  initials = computed(() => {
    const name = this.userName();
    const parts = name.split(' ');
    return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
  });
  goToProject() {
    this.projectService.getAllProjects(0, 10).subscribe({
      next: (res => {
        console.log(res);
        this.userName.set(localStorage?.getItem('userName') ?? '');
        this.projectCount.set(res?.content?.length);
      }),
      error: (err => {

      })
    })
    // this.router.navigate(['/projects'])
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(v => !v);
  }

  closeMobileMenu() {
    this.isMobileMenuOpen.set(false);
  }
}