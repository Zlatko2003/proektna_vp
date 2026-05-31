import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-register',
    template: `
        <div class="register-page">
            <div class="container">
                <div class="register-hero">
                    <div class="register-badge">
                        🚀 Join the Community
                    </div>
                    <h1>
                        Create an
                        <span>account</span>
                    </h1>
                    <p class="hero-description">
                        Start asking questions, sharing knowledge, and connecting with developers worldwide.
                    </p>
                </div>

                <div class="register-card">
                    <div class="alert alert-error" *ngIf="errorMessage">
                        <span>⚠️ {{ errorMessage }}</span>
                        <button class="close-btn" (click)="clearError()">×</button>
                    </div>
                    
                    <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
                        <div class="form-group" [class.has-error]="registerForm.get('name')?.invalid && registerForm.get('name')?.touched">
                            <label>Full name</label>
                            <div class="input-wrapper">
                                <span class="input-icon">👤</span>
                                <input type="text" formControlName="name" placeholder="John Doe">
                            </div>
                            <div class="error-message" *ngIf="registerForm.get('name')?.invalid && registerForm.get('name')?.touched">
                                Name is required
                            </div>
                        </div>
                        
                        <div class="form-group" [class.has-error]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched">
                            <label>Email address</label>
                            <div class="input-wrapper">
                                <span class="input-icon">📧</span>
                                <input type="email" formControlName="email" placeholder="you@example.com">
                            </div>
                            <div class="error-message" *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched">
                                <span *ngIf="registerForm.get('email')?.errors?.['required']">Email is required</span>
                                <span *ngIf="registerForm.get('email')?.errors?.['email']">Valid email address is required</span>
                            </div>
                        </div>
                        
                        <div class="form-group" [class.has-error]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched">
                            <label>Password</label>
                            <div class="input-wrapper">
                                <span class="input-icon">🔒</span>
                                <input type="password" formControlName="password" placeholder="Create a password">
                            </div>
                            <div class="error-message" *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched">
                                <span *ngIf="registerForm.get('password')?.errors?.['required']">Password is required</span>
                                <span *ngIf="registerForm.get('password')?.errors?.['minlength']">Password must be at least 6 characters</span>
                            </div>
                            <div class="password-strength" *ngIf="registerForm.get('password')?.value?.length > 0">
                                <div class="strength-bar">
                                    <div class="strength-fill" [style.width.%]="passwordStrength" [style.background]="strengthColor"></div>
                                </div>
                                <span class="strength-text" [style.color]="strengthColor">{{ strengthText }}</span>
                            </div>
                        </div>
                        
                        <div class="form-group" [class.has-error]="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched">
                            <label>Confirm password</label>
                            <div class="input-wrapper">
                                <span class="input-icon">✓</span>
                                <input type="password" formControlName="confirmPassword" placeholder="Confirm your password">
                            </div>
                            <div class="error-message" *ngIf="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched">
                                <span *ngIf="registerForm.get('confirmPassword')?.errors?.['required']">Please confirm your password</span>
                                <span *ngIf="registerForm.get('confirmPassword')?.errors?.['mismatch']">Passwords do not match</span>
                            </div>
                        </div>
                        
                        <button type="submit" class="submit-btn" [disabled]="registerForm.invalid || isLoading">
                            {{ isLoading ? 'Creating account...' : 'Create Account' }}
                        </button>
                    </form>
                    
                    <div class="auth-footer">
                        <p>Already have an account? <a routerLink="/login">Sign in</a></p>
                    </div>
                </div>
            </div>
        </div>
        <style>
            .register-page {
                background: var(--bg-light);
                min-height: 100vh;
                padding: 60px 0;
            }
            
            .register-hero {
                text-align: center;
                max-width: 700px;
                margin: 0 auto 48px;
            }
            
            .register-badge {
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
            
            .register-hero h1 {
                font-size: clamp(2rem, 5vw, 3rem);
                font-weight: 800;
                margin-bottom: 16px;
                color: var(--dark);
            }
            
            .register-hero h1 span {
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
            
            .register-card {
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
            
            .password-strength {
                margin-top: 8px;
            }
            
            .strength-bar {
                height: 4px;
                background: var(--gray-lighter);
                border-radius: 4px;
                overflow: hidden;
                margin-bottom: 4px;
            }
            
            .strength-fill {
                height: 100%;
                transition: width 0.3s;
            }
            
            .strength-text {
                font-size: 11px;
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
                .register-page {
                    padding: 40px 0;
                }
                
                .register-card {
                    padding: 28px;
                }
            }
        </style>
    `
})
export class RegisterComponent implements OnDestroy {
    registerForm: FormGroup;
    errorMessage: string | null = null;
    isLoading = false;
    private errorSubscription: Subscription;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.registerForm = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', [Validators.required]]
        }, { validators: this.passwordMatchValidator });
        
        this.errorSubscription = this.authService.error$.subscribe(error => {
            this.errorMessage = error;
            this.isLoading = false;
        });
    }

    passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
        const password = control.get('password')?.value;
        const confirm = control.get('confirmPassword')?.value;
        return password === confirm ? null : { mismatch: true };
    }

    get passwordStrength(): number {
        const pwd = this.registerForm.get('password')?.value || '';
        if (pwd.length === 0) return 0;
        if (pwd.length < 6) return 25;
        if (pwd.length < 10) return 60;
        return 100;
    }

    get strengthColor(): string {
        const pwd = this.registerForm.get('password')?.value || '';
        if (pwd.length === 0) return '';
        if (pwd.length < 6) return 'var(--danger)';
        if (pwd.length < 10) return 'var(--warning)';
        return 'var(--secondary)';
    }

    get strengthText(): string {
        const pwd = this.registerForm.get('password')?.value || '';
        if (pwd.length === 0) return '';
        if (pwd.length < 6) return 'Weak password';
        if (pwd.length < 10) return 'Medium password';
        return 'Strong password';
    }

    ngOnDestroy(): void {
        this.errorSubscription?.unsubscribe();
    }

    clearError(): void {
        this.errorMessage = null;
        this.authService.clearError();
    }

    onSubmit(): void {
        if (this.registerForm.valid) {
            this.isLoading = true;
            this.errorMessage = null;
            const { name, email, password } = this.registerForm.value;
            this.authService.register(name, email, password).subscribe({
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