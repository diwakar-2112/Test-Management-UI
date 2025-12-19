import { Injectable, signal, effect, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private document = inject(DOCUMENT);
  
  // Signal to hold the current theme state ('light' or 'dark')
  themeSignal = signal<'light' | 'dark'>(this.getInitialTheme());

  constructor() {
    // Effect runs whenever themeSignal changes
    effect(() => {
      const theme = this.themeSignal();
      
      if (theme === 'dark') {
        this.document.documentElement.classList.add('dark-theme');
      } else {
        this.document.documentElement.classList.remove('dark-theme');
      }
      
      // Save to local storage
      localStorage.setItem('user-theme', theme);
    });
  }

  toggleTheme() {
    this.themeSignal.update(current => (current === 'light' ? 'dark' : 'light'));
  }

  private getInitialTheme(): 'light' | 'dark' {
    const savedTheme = localStorage.getItem('user-theme') as 'light' | 'dark';
    if (savedTheme) return savedTheme;

    // Optional: Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}