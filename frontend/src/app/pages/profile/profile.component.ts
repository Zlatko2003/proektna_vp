import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { QuestionService } from '../../services/question.service';
import { User } from '../../models/user.model';
import { Question } from '../../models/question.model';

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

                <div class="profile-card">
                    <div class="profile-avatar">
                        <div class="avatar-large">{{ userInitial }}</div>
                        <div class="badge" [class.admin]="user.role === 'admin'">
                            {{ user.role === 'admin' ? 'Administrator' : (user.role === 'user' ? 'Member' : 'Guest') }}
                        </div>
                    </div>
                    <div class="profile-info">
                        <h2>{{ user.name }}</h2>
                        <p class="email">{{ user.email }}</p>
                        <p class="joined">Member since {{ user.createdAt | date:'MMMM d, yyyy' }}</p>
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
                </div>

                <div class="questions-section">
                    <div class="section-header">
                        <h3>📝 My Questions</h3>
                        <a routerLink="/ask" class="ask-link">+ Ask New Question</a>
                    </div>
                    
                    <div *ngIf="loadingQuestions" class="loading">
                        <div class="spinner"></div>
                        <p>Loading your questions...</p>
                    </div>
                    
                    <div *ngIf="!loadingQuestions && userQuestions.length === 0" class="empty-state">
                        <div class="empty-icon">🤔</div>
                        <p>You haven't asked any questions yet.</p>
                        <a routerLink="/ask" class="btn-primary">Ask a Question</a>
                    </div>
                    
                    <!-- Using the same question-card component as questions page -->
                    <app-question-card 
                        *ngFor="let question of userQuestions" 
                        [question]="question">
                    </app-question-card>
                </div>
            </div>
        </div>
        <style>
            .profile-page {
                background: var(--bg-light);
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
                color: var(--primary);
                font-size: 13px;
                font-weight: 600;
            }
            
            .profile-hero h1 {
                font-size: clamp(2rem, 5vw, 3rem);
                font-weight: 800;
                margin-bottom: 16px;
                color: var(--dark);
            }
            
            .profile-hero h1 span {
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
            
            .profile-card {
                background: white;
                border-radius: 24px;
                padding: 32px;
                margin-bottom: 32px;
                display: flex;
                gap: 32px;
                align-items: center;
                flex-wrap: wrap;
                box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            }
            
            .profile-avatar {
                text-align: center;
            }
            
            .avatar-large {
                width: 100px;
                height: 100px;
                background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 42px;
                font-weight: 700;
                color: white;
                margin-bottom: 12px;
            }
            
            .badge {
                display: inline-block;
                padding: 4px 12px;
                background: var(--bg-light);
                border-radius: 20px;
                font-size: 12px;
                font-weight: 500;
            }
            
            .badge.admin {
                background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
                color: white;
            }
            
            .profile-info h2 {
                font-size: 28px;
                margin-bottom: 8px;
            }
            
            .email {
                color: var(--gray);
                margin-bottom: 8px;
            }
            
            .joined {
                font-size: 13px;
                color: var(--gray-light);
            }
            
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
                margin-bottom: 40px;
            }
            
            .stat-card {
                background: white;
                border-radius: 20px;
                padding: 24px;
                text-align: center;
                box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                transition: all 0.2s;
            }
            
            .stat-card:hover {
                transform: translateY(-4px);
            }
            
            .stat-value {
                font-size: 32px;
                font-weight: 800;
                color: var(--primary);
            }
            
            .stat-label {
                font-size: 13px;
                color: var(--gray);
                margin-top: 4px;
            }
            
            .questions-section {
                background: white;
                border-radius: 24px;
                padding: 32px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            }
            
            .section-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;
                gap: 16px;
                margin-bottom: 24px;
                padding-bottom: 16px;
                border-bottom: 1px solid var(--gray-lighter);
            }
            
            .section-header h3 {
                font-size: 20px;
            }
            
            .ask-link {
                padding: 8px 20px;
                background: var(--primary);
                color: white;
                text-decoration: none;
                border-radius: 40px;
                font-size: 14px;
                font-weight: 500;
                transition: all 0.2s;
            }
            
            .ask-link:hover {
                background: var(--primary-dark);
                transform: translateY(-2px);
            }
            
            .loading {
                text-align: center;
                padding: 40px;
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
            
            .btn-primary {
                display: inline-block;
                padding: 10px 24px;
                background: var(--primary);
                color: white;
                text-decoration: none;
                border-radius: 40px;
                font-weight: 500;
                transition: all 0.2s;
            }
            
            .btn-primary:hover {
                background: var(--primary-dark);
                transform: translateY(-2px);
            }
            
            @media (max-width: 768px) {
                .profile-page {
                    padding: 40px 0;
                }
                
                .profile-card {
                    flex-direction: column;
                    text-align: center;
                }
                
                .stats-grid {
                    gap: 12px;
                }
                
                .stat-value {
                    font-size: 28px;
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

    get userInitial(): string {
        return this.user?.name?.charAt(0)?.toUpperCase() || '?';
    }

    constructor(
        private authService: AuthService,
        private questionService: QuestionService
    ) { }

    ngOnInit(): void {
        this.authService.user$.subscribe(user => {
            this.user = user;
            if (user) {
                this.loadUserQuestions();
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
        this.totalAnswers = 0; // Will be calculated from answer service
        this.totalViews = this.userQuestions.reduce((sum, q) => sum + (q.views || 0), 0);
    }
}