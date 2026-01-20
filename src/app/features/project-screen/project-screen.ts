import { Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-screen.html',
  styleUrl: './project-screen.css',
})
export class ProjectScreen {
  // Input binding from URL parameter :projectId
  projectId = input.required<string>();

  // Example of using the ID
  displayId = computed(() => `Project ID: ${this.projectId()}`);
}
