import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../../../services/project.service';
import { ProjectList } from '../projects/project-list/project-list';
// Material Imports
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../services/theme.service.ts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    ProjectList
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css', // Ensure styles.scss/css matches
})
export class Dashboard implements OnInit {
  private projectService = inject(ProjectService);
  themeService = inject(ThemeService);
  
  // Mobile Sidebar State
  isMobileMenuOpen = signal(false);

  projectCount = signal(0);
  userName = signal('Admin User');
  
  initials = computed(() => {
    const name = this.userName();
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return (name[0] || 'A').toUpperCase();
  });

  ngOnInit(): void {
    // Mock Data Load (Replace with your actual API call)
    this.projectCount.set(12); 
    // Logic for loading real data...
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