import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-access-denied-page',
  imports: [],
  templateUrl: './access-denied-page.html',
  styleUrl: './access-denied-page.css',
})
export class AccessDeniedPage {
  private router = inject(Router);
  goToDashboard() {
    this.router.navigate(['/projects']);
  }
}
