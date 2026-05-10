import { Component, computed, inject, signal,NgZone, OnInit } from '@angular/core';
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
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// import { AuthService } from '../../../core/auth/auth.service';
import { CommonService as commonService } from '../../../../../services/commonService';
//Google login
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../enviorments/environment';
declare var google:any;
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
    TabsModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(commonService);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private http = inject(HttpClient);
  private ngZone = inject(NgZone);
  private clientId = environment.googleClientId;
   ngOnInit(): void {
    // Initialize the Google SDK
     google.accounts.id.initialize({
      client_id:this.clientId,
      // Tell Google which function to call when the user logs in
      callback:this.handleGoogleLogin.bind(this)
     })

     //  Tell Google to draw the button inside our HTML div
    google.accounts.id.renderButton(
      document.getElementById('google-btn'),
      { theme: 'outline', size: 'large', width: '100%',shape:'pill' } ,
      google.accounts.id.prompt()
    );
   }
   handleGoogleLogin(response:any){
    const googleIdtoken = response.credential;
    this.ngZone.run(()=>{
      this.authService.googleAuthLogin(googleIdtoken).subscribe({
        next:(res:any)=>{
          localStorage.setItem('token', res.accessToken);
          localStorage.setItem('userName', res.userName)
          this.router.navigate(['/dashboard']);
        },
        error:(err=>{
          console.log('token error',err);
        })
      })
    })
   }
  showError() {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: this.errorMessage(),
    });
  }
  errorMessage = signal('');
  isLoading = signal(false);
  isSignupMode = signal(false);

  isRegisterMode = signal(false);
  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    // confirmPassword: [{ value: '', disabled: true }, Validators.required]
  });

  toggleMode() {
    this.isRegisterMode.update((v) => !v);
    // if (this.isRegisterMode()) {
    //   this.loginForm.get('confirmPassword')?.enable();
    // } else {
    //   this.loginForm.get('confirmPassword')?.disable();
    // }
    this.errorMessage.set('');
    this.loginForm.reset();
  }

  readonly isSignup = computed(() => this.isSignupMode());
  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set('');
    const credentials = this.loginForm.getRawValue(); // use getRawValue to get disabled fields if needed, but here we enable it

    if (this.isSignupMode()) {
      // if (credentials.password !== credentials.confirmPassword) {
      //   this.errorMessage.set('Passwords do not match');
      //   this.isLoading.set(false);
      //   return;
      // }
      console.log('yes regis mode');

      this.register(credentials);
    } else {
      console.log('login mode');

      this.authService.login(credentials).subscribe({
        next: (res) => {
          console.log('Login Success:', res);
          this.isLoading.set(false);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Login Failed:', err);
          this.isLoading.set(false);
          this.errorMessage.set(err.error.message);
          this.showError();
        },
      });
    }
  }

  register(data: any) {
    this.authService.register(data).subscribe({
      next: (res) => {
        console.log('Register Success:', res);
        this.isLoading.set(false);
        // Navigate to the Dashboard/Projects page after success
        this.isRegisterMode();
        this.isSignupMode.update((v) => !v);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error.message);
        this.showError();
      },
    });
  }

  // Helper to check form validity for UI
  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control?.invalid && (control?.dirty || control?.touched));
  }
  toggleSign() {
    this.isSignupMode.update((v) => !v);
    this.errorMessage.set('');
    this.loginForm.reset();
  }
}
