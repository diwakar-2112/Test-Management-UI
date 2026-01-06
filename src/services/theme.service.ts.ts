import { Injectable, signal, effect, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private document = inject(DOCUMENT);
  
  // Default 'dark' agar local storage mein kuch nahi hai
  themeSignal = signal<'light' | 'dark'>(this.getInitialTheme());

  constructor() {
    effect(() => {
      const theme = this.themeSignal();
      const html = this.document.documentElement;

      // Tailwind expects 'dark' class on <html>
      if (theme === 'dark') {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }
      
      localStorage.setItem('user-theme', theme);
    });
  }

  toggleTheme() {
    this.themeSignal.update(current => (current === 'light' ? 'dark' : 'light'));
  }

  private getInitialTheme(): 'light' | 'dark' {
    const savedTheme = localStorage.getItem('user-theme') as 'light' | 'dark';
    // Logic: Agar saved nahi hai, toh Default DARK return karo
    return savedTheme ? savedTheme : 'dark';
  }
}