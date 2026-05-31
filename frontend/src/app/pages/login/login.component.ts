import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-login',
    template: `
        <div class="login-page">
            <div class="container">
                <div class="login-hero">
                    <div class="login-badge">
                        🔐 Welcome Back
                    </div>
                    <h1>
                        Sign in to
                        <span>DevQ&A</span>
                    </h1>
                    <p class="hero-description">
                        Join thousands of developers sharing knowledge and solving problems together.
                    </p>
                </div>

                <div class="login-card">
                    <div class="alert alert-error" *ngIf="errorMessage">
                        <span>⚠️ {{ errorMessage }}</span>
                        <button class="close-btn" (click)="clearError()">×</button>
                    </div>
                    
                    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                        <div class="form-group" [class.has-error]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
                            <label>Email address</label>
                            <div class="input-wrapper">
                                <span class="input-icon">📧</span>
                                <input type="email" formControlName="email" placeholder="you@example.com">
                            </div>
                            <div class="error-message" *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
                                Valid email address is required
                            </div>
                        </div>
                        
                        <div class="form-group" [class.has-error]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
                            <label>Password</label>
                            <div class="input-wrapper">
                                <span class="input-icon">🔒</span>
                                <input type="password" formControlName="password" placeholder="Enter your password">
                            </div>
                            <div class="error-message" *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
                                Password is required
                            </div>
                        </div>
                        
                        <button type="submit" class="submit-btn" [disabled]="loginForm.invalid || isLoading">
                            {{ isLoading ? 'Signing in...' : 'Sign In' }}
                        </button>
                    </form>
                    
                    <div class="auth-footer">
                        <p>Don't have an account? <a routerLink="/register">Create an account</a></p>
                    </div>
                </div>
            </div>
        </div>
        <style>
            .login-page {
                background: var(--bg-light);
                min-height: 100vh;
                padding: 60px 0;
            }
            
            .login-hero {
                text-align: center;
                max-width: 700px;
                margin: 0 auto 48px;
            }
            
            .login-badge {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                padding: 6px 14px;
                margin-bottom: 20px;
                background: rgba(99,102,241,.08);
                border-radius: 999px;
                color: var(--primary);
                font-size: 13px;
                font-weight: 600;
            }
            
            .login-hero h1 {
                font-size: clamp(2rem, 5vw, 3rem);
                font-weight: 800;
                margin-bottom: 16px;
                color: var(--dark);
            }
            
            .login-hero h1 span {
                background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            
            .hero-description {
                font-size: 1.05rem;
                color: var(--gray);
                max-width: 500px;
                margin: 0 auto;
            }
            
            .login-card {
                max-width: 480px;
                margin: 0 auto;
                background: white;
                border-radius: 24px;
                padding: 40px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            }
            
            .alert {
                padding: 14px 18px;
                border-radius: 16px;
                margin-bottom: 24px;
                position: relative;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .alert-error {
                background-color: #fef2f2;
                color: var(--danger);
                border: 1px solid #fecaca;
            }
            
            .close-btn {
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                color: inherit;
                opacity: 0.6;
            }
            
            .close-btn:hover {
                opacity: 1;
            }
            
            .form-group {
                margin-bottom: 24px;
            }
            
            .form-group label {
                display: block;
                margin-bottom: 8px;
                font-weight: 600;
                font-size: 14px;
                color: var(--dark);
            }
            
            .input-wrapper {
                position: relative;
            }
            
            .input-icon {
                position: absolute;
                left: 14px;
                top: 50%;
                transform: translateY(-50%);
                font-size: 18px;
                opacity: 0.6;
            }
            
            .input-wrapper input {
                width: 100%;
                padding: 14px 14px 14px 44px;
                border: 2px solid var(--gray-lighter);
                border-radius: 14px;
                font-size: 15px;
                transition: all 0.2s;
                background: white;
            }
            
            .input-wrapper input:focus {
                outline: none;
                border-color: var(--primary);
                box-shadow: 0 0 0 3px rgba(99,102,241,.1);
            }
            
            .form-group.has-error input {
                border-color: var(--danger);
                background: #fef2f2;
            }
            
            .error-message {
                color: var(--danger);
                font-size: 12px;
                margin-top: 6px;
            }
            
            .submit-btn {
                width: 100%;
                padding: 14px;
                background: var(--primary);
                color: white;
                border: none;
                border-radius: 40px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
                margin-top: 8px;
            }
            
            .submit-btn:hover:not(:disabled) {
                background: var(--primary-dark);
                transform: translateY(-2px);
            }
            
            .submit-btn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }
            
            .auth-footer {
                text-align: center;
                margin-top: 28px;
                padding-top: 20px;
                border-top: 1px solid var(--gray-lighter);
            }
            
            .auth-footer p {
                font-size: 14px;
                color: var(--gray);
            }
            
            .auth-footer a {
                color: var(--primary);
                text-decoration: none;
                font-weight: 600;
            }
            
            .auth-footer a:hover {
                text-decoration: underline;
            }
            
            @media (max-width: 768px) {
                .login-page {
                    padding: 40px 0;
                }
                
                .login-card {
                    padding: 28px;
                }
            }
        </style>
    `
})
export class LoginComponent implements OnDestroy {
    loginForm: FormGroup;
    errorMessage: string | null = null;
    isLoading = false;
    private errorSubscription: Subscription;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
        
        this.errorSubscription = this.authService.error$.subscribe(error => {
            this.errorMessage = error;
            this.isLoading = false;
        });
    }

    ngOnDestroy(): void {
        this.errorSubscription?.unsubscribe();
    }

    clearError(): void {
        this.errorMessage = null;
        this.authService.clearError();
    }

    onSubmit(): void {
        if (this.loginForm.valid) {
            this.isLoading = true;
            this.errorMessage = null;
            const { email, password } = this.loginForm.value;
            this.authService.login(email, password).subscribe({
                next: () => {
                    this.isLoading = false;
                    this.router.navigate(['/']);
                },
                error: () => {
                    this.isLoading = false;
                }
            });
        }
    }
}