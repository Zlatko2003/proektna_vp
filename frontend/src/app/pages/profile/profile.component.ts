import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { QuestionService } from '../../services/question.service';
import { User } from '../../models/user.model';
import { Question } from '../../models/question.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-profile',
    template: `
        <div class="profile-page">
            <div class="container" *ngIf="user">
                <div class="profile-hero">
                    <div class="profile-badge">
                        👤 Your Profile
                    </div>
                    <h1>
                        Welcome,
                        <span>{{ user.name }}</span>
                    </h1>
                    <p class="hero-description">
                        Manage your questions and track your activity on DevQ&A.
                    </p>
                </div>

                <div class="alert alert-success" *ngIf="successMessage">
                    <span>✅ {{ successMessage }}</span>
                    <button class="close-btn" (click)="successMessage = null">×</button>
                </div>
                <div class="alert alert-error" *ngIf="errorMessage">
                    <span>⚠️ {{ errorMessage }}</span>
                    <button class="close-btn" (click)="errorMessage = null">×</button>
                </div>

                <div class="profile-card">
                    <div class="profile-avatar">
                        <div class="avatar-large">{{ userInitial }}</div>
                        <div class="badge" [class.admin]="user.role === 'admin'">
                            {{ user.role === 'admin' ? 'Administrator' : (user.role === 'user' ? 'Member' : 'Guest') }}
                        </div>
                    </div>
                    <div class="profile-info">
                        <div *ngIf="!isEditing" class="profile-details">
                            <h2>{{ user.name }}</h2>
                            <p class="email">{{ user.email }}</p>
                            <p class="joined">Member since {{ user.createdAt | date:'MMMM d, yyyy' }}</p>
                            <button class="edit-profile-btn" (click)="toggleEdit()">✏️ Edit Profile</button>
                        </div>
                        
                        <div *ngIf="isEditing" class="edit-form">
                            <form [formGroup]="editForm" (ngSubmit)="saveProfile()">
                                <div class="form-group">
                                    <label>Full Name</label>
                                    <input 
                                        type="text" 
                                        formControlName="name" 
                                        class="form-control"
                                        placeholder="Enter your name">
                                    <small class="error" *ngIf="editForm.get('name')?.invalid && editForm.get('name')?.touched">
                                        Name is required
                                    </small>
                                </div>
                                <div class="form-group">
                                    <label>Email</label>
                                    <input 
                                        type="email" 
                                        formControlName="email" 
                                        class="form-control"
                                        placeholder="Enter your email">
                                    <small class="error" *ngIf="editForm.get('email')?.invalid && editForm.get('email')?.touched">
                                        Valid email is required
                                    </small>
                                </div>
                                <div class="form-group">
                                    <label>Bio / About</label>
                                    <textarea 
                                        formControlName="bio" 
                                        class="form-control" 
                                        rows="3"
                                        placeholder="Tell us about yourself..."></textarea>
                                </div>
                                <div class="form-group">
                                    <label>Location</label>
                                    <input 
                                        type="text" 
                                        formControlName="location" 
                                        class="form-control"
                                        placeholder="Your location">
                                </div>
                                <div class="form-actions">
                                    <button type="submit" class="save-btn" [disabled]="editForm.invalid || isSaving">
                                        {{ isSaving ? 'Saving...' : '💾 Save Changes' }}
                                    </button>
                                    <button type="button" class="cancel-btn" (click)="toggleEdit()">Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-value">{{ userQuestions.length }}</div>
                        <div class="stat-label">Questions Asked</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">{{ totalAnswers }}</div>
                        <div class="stat-label">Answers Given</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">{{ totalViews }}</div>
                        <div class="stat-label">Total Views</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">{{ user.reputation || 0 }}</div>
                        <div class="stat-label">🌟 Reputation</div>
                    </div>
                </div>

                <div class="quick-actions">
                    <a routerLink="/ask" class="quick-action-btn ask">
                        <span class="qa-icon">✍️</span> Ask a Question
                    </a>
                    <a routerLink="/questions" class="quick-action-btn browse">
                        <span class="qa-icon">🔍</span> Browse Questions
                    </a>
                    <button class="quick-action-btn logout" (click)="logout()">
                        <span class="qa-icon">🚪</span> Logout
                    </button>
                </div>

                <div class="questions-section">
                    <div class="section-header">
                        <h3>📝 My Questions</h3>
                        <div class="header-actions">
                            <button class="filter-btn" (click)="sortQuestions('newest')" [class.active]="sortBy === 'newest'">
                                Newest
                            </button>
                            <button class="filter-btn" (click)="sortQuestions('popular')" [class.active]="sortBy === 'popular'">
                                Popular
                            </button>
                            <a routerLink="/ask" class="ask-link">+ Ask New</a>
                        </div>
                    </div>
                    
                    <div *ngIf="loadingQuestions" class="loading">
                        <div class="spinner"></div>
                        <p>Loading your questions...</p>
                    </div>
                    
                    <div *ngIf="!loadingQuestions && sortedQuestions.length === 0" class="empty-state">
                        <div class="empty-icon">🤔</div>
                        <p>You haven't asked any questions yet.</p>
                        <a routerLink="/ask" class="btn-primary">Ask a Question</a>
                    </div>
                    
                    <app-question-card 
                        *ngFor="let question of sortedQuestions" 
                        [question]="question">
                    </app-question-card>
                </div>
            </div>
        </div>
        <style>
            .profile-page {
                background: #f8fafc;
                min-height: 100vh;
                padding: 60px 0;
            }
            
            .profile-hero {
                text-align: center;
                max-width: 700px;
                margin: 0 auto 48px;
            }
            
            .profile-badge {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                padding: 6px 14px;
                margin-bottom: 20px;
                background: rgba(99,102,241,.08);
                border-radius: 999px;
                color: #6366f1;
                font-size: 13px;
                font-weight: 600;
            }
            
            .profile-hero h1 {
                font-size: clamp(2rem, 5vw, 3rem);
                font-weight: 800;
                margin-bottom: 16px;
                color: #0f172a;
            }
            
            .profile-hero h1 span {
                background: linear-gradient(135deg, #6366f1, #8b5cf6);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            
            .hero-description {
                font-size: 1.05rem;
                color: #64748b;
                max-width: 500px;
                margin: 0 auto;
            }
            
            .alert {
                padding: 12px 18px;
                border-radius: 12px;
                margin-bottom: 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-weight: 500;
                font-size: 14px;
                animation: slideDown 0.3s ease;
            }
            
            @keyframes slideDown {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .alert-success {
                background: #ecfdf5;
                color: #059669;
                border: 1px solid #a7f3d0;
            }
            
            .alert-error {
                background: #fef2f2;
                color: #dc2626;
                border: 1px solid #fecaca;
            }
            
            .close-btn {
                background: none;
                border: none;
                font-size: 22px;
                cursor: pointer;
                color: inherit;
                opacity: 0.6;
                transition: all 0.2s;
                line-height: 1;
            }
            
            .close-btn:hover {
                opacity: 1;
                transform: scale(1.2);
            }
            
            .profile-card {
                background: white;
                border-radius: 24px;
                padding: 32px;
                margin-bottom: 32px;
                display: flex;
                gap: 32px;
                align-items: flex-start;
                flex-wrap: wrap;
                box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                border: 1px solid rgba(0,0,0,0.03);
            }
            
            .profile-avatar {
                text-align: center;
                min-width: 120px;
            }
            
            .avatar-large {
                width: 100px;
                height: 100px;
                background: linear-gradient(135deg, #6366f1, #8b5cf6);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 42px;
                font-weight: 700;
                color: white;
                margin-bottom: 8px;
                margin: 0 auto 8px;
            }
            
            .edit-avatar-btn {
                margin-top: 8px;
                padding: 4px 14px;
                background: #f1f5f9;
                border: none;
                border-radius: 16px;
                font-size: 12px;
                cursor: pointer;
                color: #64748b;
                transition: all 0.2s;
            }
            
            .edit-avatar-btn:hover {
                background: #e2e8f0;
            }
            
            .badge {
                display: inline-block;
                padding: 4px 12px;
                background: #f1f5f9;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 500;
                color: #64748b;
                margin-top: 4px;
            }
            
            .badge.admin {
                background: linear-gradient(135deg, #6366f1, #8b5cf6);
                color: white;
            }
            
            .profile-info {
                flex: 1;
                min-width: 200px;
            }
            
            .profile-details h2 {
                font-size: 28px;
                margin-bottom: 4px;
                color: #0f172a;
            }
            
            .profile-details .email {
                color: #64748b;
                margin-bottom: 4px;
            }
            
            .profile-details .joined {
                font-size: 13px;
                color: #94a3b8;
                margin-bottom: 16px;
            }
            
            .edit-profile-btn {
                padding: 8px 20px;
                background: #6366f1;
                color: white;
                border: none;
                border-radius: 40px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                transition: all 0.2s;
            }
            
            .edit-profile-btn:hover {
                background: #4f46e5;
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(99,102,241,.3);
            }
            
            .edit-form {
                width: 100%;
                max-width: 500px;
            }
            
            .form-group {
                margin-bottom: 16px;
            }
            
            .form-group label {
                display: block;
                font-size: 13px;
                font-weight: 600;
                color: #0f172a;
                margin-bottom: 4px;
            }
            
            .form-control {
                width: 100%;
                padding: 10px 14px;
                border: 2px solid #e2e8f0;
                border-radius: 12px;
                font-size: 14px;
                transition: all 0.3s ease;
                background: #f8fafc;
            }
            
            .form-control:focus {
                outline: none;
                border-color: #6366f1;
                box-shadow: 0 0 0 4px rgba(99,102,241,.1);
                background: white;
            }
            
            textarea.form-control {
                resize: vertical;
                font-family: inherit;
            }
            
            .error {
                color: #dc2626;
                font-size: 12px;
                display: block;
                margin-top: 4px;
            }
            
            .form-actions {
                display: flex;
                gap: 12px;
                margin-top: 20px;
            }
            
            .save-btn {
                padding: 10px 24px;
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
                border: none;
                border-radius: 40px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 600;
                transition: all 0.2s;
            }
            
            .save-btn:hover:not(:disabled) {
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(16,185,129,.3);
            }
            
            .save-btn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }
            
            .cancel-btn {
                padding: 10px 24px;
                background: #f1f5f9;
                color: #64748b;
                border: none;
                border-radius: 40px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 600;
                transition: all 0.2s;
            }
            
            .cancel-btn:hover {
                background: #e2e8f0;
            }
            
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 16px;
                margin-bottom: 32px;
            }
            
            .stat-card {
                background: white;
                border-radius: 16px;
                padding: 20px;
                text-align: center;
                box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                border: 1px solid rgba(0,0,0,0.03);
                transition: all 0.2s;
            }
            
            .stat-card:hover {
                transform: translateY(-3px);
                box-shadow: 0 8px 25px rgba(99,102,241,.1);
            }
            
            .stat-value {
                font-size: 28px;
                font-weight: 800;
                color: #6366f1;
            }
            
            .stat-label {
                font-size: 12px;
                color: #94a3b8;
                margin-top: 4px;
            }
            
            .quick-actions {
                display: flex;
                gap: 12px;
                flex-wrap: wrap;
                margin-bottom: 32px;
            }
            
            .quick-action-btn {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                padding: 12px 24px;
                border-radius: 40px;
                font-size: 14px;
                font-weight: 600;
                text-decoration: none;
                cursor: pointer;
                border: none;
                transition: all 0.3s ease;
            }
            
            .quick-action-btn .qa-icon {
                font-size: 18px;
            }
            
            .quick-action-btn.ask {
                background: linear-gradient(135deg, #6366f1, #8b5cf6);
                color: white;
                box-shadow: 0 4px 15px rgba(99,102,241,.3);
            }
            
            .quick-action-btn.ask:hover {
                transform: translateY(-3px);
                box-shadow: 0 8px 25px rgba(99,102,241,.4);
            }
            
            .quick-action-btn.browse {
                background: #f1f5f9;
                color: #0f172a;
            }
            
            .quick-action-btn.browse:hover {
                background: #e2e8f0;
                transform: translateY(-3px);
            }
            
            .quick-action-btn.logout {
                background: #fee2e2;
                color: #dc2626;
            }
            
            .quick-action-btn.logout:hover {
                background: #fecaca;
                transform: translateY(-3px);
            }
            
            .questions-section {
                background: white;
                border-radius: 24px;
                padding: 32px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                border: 1px solid rgba(0,0,0,0.03);
            }
            
            .section-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;
                gap: 16px;
                margin-bottom: 24px;
                padding-bottom: 16px;
                border-bottom: 1px solid #f1f5f9;
            }
            
            .section-header h3 {
                font-size: 18px;
                font-weight: 700;
                color: #0f172a;
            }
            
            .header-actions {
                display: flex;
                gap: 8px;
                align-items: center;
                flex-wrap: wrap;
            }
            
            .filter-btn {
                padding: 4px 14px;
                background: transparent;
                border: 1px solid #e2e8f0;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 500;
                cursor: pointer;
                color: #64748b;
                transition: all 0.2s;
            }
            
            .filter-btn:hover {
                background: #f1f5f9;
            }
            
            .filter-btn.active {
                background: #6366f1;
                color: white;
                border-color: #6366f1;
            }
            
            .ask-link {
                padding: 6px 16px;
                background: #6366f1;
                color: white;
                text-decoration: none;
                border-radius: 40px;
                font-size: 13px;
                font-weight: 500;
                transition: all 0.2s;
            }
            
            .ask-link:hover {
                background: #4f46e5;
                transform: translateY(-2px);
            }
            
            .loading {
                text-align: center;
                padding: 40px;
            }
            
            .spinner {
                width: 32px;
                height: 32px;
                margin: 0 auto 12px;
                border: 3px solid #f1f5f9;
                border-top-color: #6366f1;
                border-radius: 50%;
                animation: spin 0.8s linear infinite;
            }
            
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
            
            .empty-state {
                text-align: center;
                padding: 40px;
            }
            
            .empty-icon {
                font-size: 48px;
                margin-bottom: 16px;
                opacity: 0.5;
            }
            
            .empty-state p {
                color: #94a3b8;
                font-size: 15px;
                margin-bottom: 16px;
            }
            
            .btn-primary {
                display: inline-block;
                padding: 10px 24px;
                background: #6366f1;
                color: white;
                text-decoration: none;
                border-radius: 40px;
                font-weight: 500;
                transition: all 0.2s;
            }
            
            .btn-primary:hover {
                background: #4f46e5;
                transform: translateY(-2px);
            }
            
            @media (max-width: 768px) {
                .profile-page {
                    padding: 40px 0;
                }
                
                .profile-card {
                    flex-direction: column;
                    text-align: center;
                    align-items: center;
                }
                
                .profile-info {
                    text-align: center;
                }
                
                .edit-form {
                    max-width: 100%;
                }
                
                .form-actions {
                    flex-direction: column;
                }
                
                .stats-grid {
                    grid-template-columns: repeat(2, 1fr);
                    gap: 12px;
                }
                
                .stat-value {
                    font-size: 24px;
                }
                
                .quick-actions {
                    flex-direction: column;
                }
                
                .quick-action-btn {
                    justify-content: center;
                }
                
                .section-header {
                    flex-direction: column;
                    align-items: stretch;
                }
                
                .header-actions {
                    justify-content: center;
                }
            }
        </style>
    `
})
export class ProfileComponent implements OnInit {
    user: User | null = null;
    userQuestions: Question[] = [];
    loadingQuestions = false;
    totalAnswers = 0;
    totalViews = 0;
    isEditing = false;
    isSaving = false;
    sortBy: 'newest' | 'popular' = 'newest';
    successMessage: string | null = null;
    errorMessage: string | null = null;
    editForm: FormGroup;

    get userInitial(): string {
        return this.user?.name?.charAt(0)?.toUpperCase() || '?';
    }

    get sortedQuestions(): Question[] {
        if (this.sortBy === 'popular') {
            return [...this.userQuestions].sort((a, b) => (b.views || 0) - (a.views || 0));
        }
        return [...this.userQuestions].sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }

    constructor(
        private authService: AuthService,
        private questionService: QuestionService,
        private fb: FormBuilder
    ) {
        this.editForm = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            bio: [''],
            location: ['']
        });
    }

    ngOnInit(): void {
        this.authService.user$.subscribe(user => {
            this.user = user;
            if (user) {
                this.loadUserQuestions();
                this.editForm.patchValue({
                    name: user.name,
                    email: user.email,
                    bio: user?.bio || '',
                    location: user?.location || ''
                });
            }
        });
    }

    loadUserQuestions(): void {
        this.loadingQuestions = true;
        this.questionService.getAllQuestions(1, '', '').subscribe({
            next: (res) => {
                this.userQuestions = res.questions.filter(
                    (q: any) => q.authorId?._id === this.user?.id
                );
                this.calculateStats();
                this.loadingQuestions = false;
            },
            error: () => {
                this.loadingQuestions = false;
            }
        });
    }

    calculateStats(): void {
        this.totalAnswers = this.userQuestions.reduce((sum, q) => sum + ((q as any).answerCount || 0), 0);
        this.totalViews = this.userQuestions.reduce((sum, q) => sum + (q.views || 0), 0);
    }

    toggleEdit(): void {
        this.isEditing = !this.isEditing;
        if (!this.isEditing) {
            this.editForm.patchValue({
                name: this.user?.name,
                email: this.user?.email,
                bio: this.user?.bio || '',
                location: this.user?.location || ''
            });
        }
    }

    saveProfile(): void {
        if (this.editForm.invalid) return;
        
        this.isSaving = true;
        this.errorMessage = null;
        this.successMessage = null;

        this.authService.updateProfile(this.editForm.value).subscribe({
            next: (updatedUser) => {
                this.user = updatedUser;
                this.successMessage = 'Profile updated successfully!';
                this.isEditing = false;
                this.isSaving = false;
                setTimeout(() => this.successMessage = null, 3000);
            },
            error: (err) => {
                this.errorMessage = err.error?.error || 'Failed to update profile';
                this.isSaving = false;
                setTimeout(() => this.errorMessage = null, 3000);
            }
        });
    }

    sortQuestions(sort: 'newest' | 'popular'): void {
        this.sortBy = sort;
    }

    logout(): void {
        if (confirm('Are you sure you want to logout?')) {
            this.authService.logout();
        }
    }
}