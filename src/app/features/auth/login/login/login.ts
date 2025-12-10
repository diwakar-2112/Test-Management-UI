import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';


import { CheckboxModule } from 'primeng/checkbox';
import { TabsModule } from 'primeng/tabs';
import { DividerModule } from 'primeng/divider';

// import { AuthService } from '../../../core/auth/auth.service';
import { ProjectService as commonService } from '../../../../../services/project.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    CardModule, 
    InputTextModule, 
    PasswordModule, 
    ButtonModule,
    MessageModule,
    CheckboxModule,
    DividerModule,
    TabsModule
    
  ],
  templateUrl:'./login.html',
  styleUrls:['./login.css']
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(commonService);
  private router = inject(Router);

  isLoading = signal(false);
  errorMessage = signal('');

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  onSubmit() {
    if (this.loginForm.invalid) return;
    this.isLoading.set(true);
    this.errorMessage.set('');
    const credentials = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: (res) => {
        console.log('Login Success:', res);
        this.isLoading.set(false);
        // Navigate to the Dashboard/Projects page after success
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Login Failed:', err);
        this.isLoading.set(false);
        this.errorMessage.set('Invalid credentials. Please try again.');
      }
    });
  }

  // Helper to check form validity for UI
  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control?.invalid && (control?.dirty || control?.touched));
  }
}