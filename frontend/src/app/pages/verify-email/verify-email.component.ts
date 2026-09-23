import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-verify-email',
    template: `
    <div class="verify-page">
      <div class="container">
        <div class="verify-card">
          <h1>Verify your email</h1>
          <p class="subtitle">
            We sent a 6-digit code to <strong>{{ email }}</strong>.
            Enter it below to activate your account.
          </p>

          <div class="alert alert-error" *ngIf="errorMessage">
            ⚠️ {{ errorMessage }}
            <button type="button" class="close-btn" (click)="clearError()">×</button>
          </div>

          <div class="alert alert-ok" *ngIf="infoMessage">
            {{ infoMessage }}
          </div>

          <form [formGroup]="verifyForm" (ngSubmit)="onSubmit()">
            <div class="form-group" [class.has-error]="verifyForm.get('code')?.invalid && verifyForm.get('code')?.touched">
              <label>Verification code</label>
              <input type="text" formControlName="code" maxlength="6" placeholder="123456" />
              <div class="error-message" *ngIf="verifyForm.get('code')?.errors?.['required'] && verifyForm.get('code')?.touched">
                Code is required
              </div>
              <div class="error-message" *ngIf="verifyForm.get('code')?.errors?.['pattern'] && verifyForm.get('code')?.touched">
                Enter the 6-digit code
              </div>
            </div>

            <button class="submit-btn" type="submit" [disabled]="verifyForm.invalid || isLoading">
              {{ isLoading ? 'Verifying...' : 'Verify email' }}
            </button>
          </form>

          <div class="footer-actions">
            <button type="button" class="link-btn" [disabled]="isResending" (click)="resend()">
              {{ isResending ? 'Sending...' : 'Resend code' }}
            </button>
            <a routerLink="/login">Back to login</a>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .verify-page { background: var(--bg-light); min-height: 100vh; padding: 60px 0; }
    .verify-card {
      max-width: 480px; margin: 0 auto; background: white; border-radius: 24px;
      padding: 40px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    h1 { font-size: 1.8rem; font-weight: 800; margin-bottom: 12px; color: var(--dark); }
    .subtitle { color: var(--gray); margin-bottom: 28px; line-height: 1.5; }
    .alert {
      padding: 14px 18px; border-radius: 16px; margin-bottom: 20px;
      display: flex; justify-content: space-between; align-items: center;
    }
    .alert-error { background: #fef2f2; color: var(--danger); border: 1px solid #fecaca; }
    .alert-ok { background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; }
    .close-btn { background: none; border: none; font-size: 20px; cursor: pointer; }
    .form-group { margin-bottom: 24px; }
    .form-group label { display: block; margin-bottom: 8px; font-weight: 600; font-size: 14px; }
    input {
      width: 100%; padding: 14px; border: 2px solid var(--gray-lighter); border-radius: 14px;
      font-size: 18px; letter-spacing: 4px; text-align: center;
    }
    input:focus { outline: none; border-color: var(--primary); }
    .has-error input { border-color: var(--danger); background: #fef2f2; }
    .error-message { color: var(--danger); font-size: 12px; margin-top: 6px; }
    .submit-btn {
      width: 100%; padding: 14px; background: var(--primary); color: white; border: none;
      border-radius: 40px; font-size: 16px; font-weight: 600; cursor: pointer;
    }
    .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .footer-actions {
      margin-top: 24px; display: flex; justify-content: space-between; align-items: center;
      font-size: 14px;
    }
    .link-btn {
      background: none; border: none; color: var(--primary); font-weight: 600; cursor: pointer;
    }
    a { color: var(--primary); text-decoration: none; font-weight: 600; }
  `]
})
export class VerifyEmailComponent implements OnDestroy {
    verifyForm: FormGroup;
    email = '';
    errorMessage: string | null = null;
    infoMessage: string | null = null;
    isLoading = false;
    isResending = false;
    private errorSubscription: Subscription;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.email =
            this.route.snapshot.queryParamMap.get('email') ||
            sessionStorage.getItem('pendingVerifyEmail') ||
            '';

        this.verifyForm = this.fb.group({
            code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
        });

        this.errorSubscription = this.authService.error$.subscribe(error => {
            this.errorMessage = error;
            this.isLoading = false;
            this.isResending = false;
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
        if (!this.email) {
            this.errorMessage = 'Missing email. Please register again.';
            return;
        }
        if (this.verifyForm.invalid) return;

        this.isLoading = true;
        this.errorMessage = null;
        const code = this.verifyForm.value.code;

        this.authService.verifyEmail(this.email, code).subscribe({
            next: () => {
                this.isLoading = false;
                this.router.navigate(['/questions']);
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    resend(): void {
        if (!this.email) {
            this.errorMessage = 'Missing email. Please register again.';
            return;
        }
        this.isResending = true;
        this.infoMessage = null;
        this.authService.resendCode(this.email).subscribe({
            next: () => {
                this.isResending = false;
                this.infoMessage = 'A new code was sent. Check your email (or backend console).';
            },
            error: () => {
                this.isResending = false;
            }
        });
    }
}