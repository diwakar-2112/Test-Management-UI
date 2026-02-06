import { Component, computed, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ThemeService } from '../../../../services/theme.service';
import { CommonService } from '../../../../services/commonService';

@Component({
    selector: 'app-main-layout',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        RouterLink,
        RouterLinkActive,
        MatIconModule
    ],
    templateUrl: './main-layout.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent implements OnInit {
    private projectService = inject(CommonService);
    themeService = inject(ThemeService);

    // Mobile Sidebar State
    isMobileMenuOpen = signal(false);
    projectCount = signal(0);
    userName = signal('');

    initials = computed(() => {
        const name = this.userName();
        if (!name) return '';
        const parts = name.split(' ');
        return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
    });

    ngOnInit(): void {
        // We can keep fetching project count for the header if needed
        // Ideally this should come from a store or a shared signal, but this works for now
        this.fetchUserInfo();
    }

    fetchUserInfo() {
        this.userName.set(localStorage?.getItem('userName') ?? 'Admin User');

        // Optional: If you really want project count in the header for all pages
        this.projectService.getAllProjects(0, 10).subscribe({
            next: (res) => {
                this.projectCount.set(res?.content?.length || 0);
            },
            error: () => {
                // Handle error silently for layout
            }
        });
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
