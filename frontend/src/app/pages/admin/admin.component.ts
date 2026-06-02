import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../../services/question.service';
import { AuthService } from '../../services/auth.service';
import { Question } from '../../models/question.model';

import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-admin',
    template: `
        <div class="admin-page">
            <div class="container">
                <div class="admin-hero">
                    <div class="admin-badge">
                        🛡️ Administration
                    </div>
                    <h1>
                        Admin
                        <span>Dashboard</span>
                    </h1>
                    <p class="hero-description">
                        Manage your DevQ&A platform, monitor activity, and control database operations.
                    </p>
                </div>

                <div class="alert alert-error" *ngIf="errorMessage">
                    <span>⚠️ {{ errorMessage }}</span>
                    <button class="close-btn" (click)="errorMessage = null">×</button>
                </div>
                
                <div class="alert alert-success" *ngIf="successMessage">
                    <span>✓ {{ successMessage }}</span>
                    <button class="close-btn" (click)="successMessage = null">×</button>
                </div>

                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">📝</div>
                        <div class="stat-value">{{ questions.length }}</div>
                        <div class="stat-label">Total Questions</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">💬</div>
                        <div class="stat-value">{{ totalAnswers }}</div>
                        <div class="stat-label">Total Answers</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">👥</div>
                        <div class="stat-value">{{ totalUsers }}</div>
                        <div class="stat-label">Total Users</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">🏷️</div>
                        <div class="stat-value">{{ totalTags }}</div>
                        <div class="stat-label">Total Tags</div>
                    </div>
                </div>

                <div class="actions-card">
                    <div class="actions-header">
                        <h3>🗄️ Database Management</h3>
                        <p>Control your database with these operations</p>
                    </div>
                    <div class="button-group">
                        <button class="btn btn-success" (click)="seedDatabase()" [disabled]="isSeeding">
                            {{ isSeeding ? 'Seeding...' : '🌱 Seed Database' }}
                        </button>
                        <button class="btn btn-danger" (click)="clearDatabase()" [disabled]="isClearing">
                            {{ isClearing ? 'Clearing...' : '🗑️ Clear Database' }}
                        </button>
                    </div>
                    <p class="warning">⚠️ Seeding will add sample data. Clearing will delete ALL data.</p>
                </div>

                <div class="chart-section" *ngIf="chartData.labels.length">
                    <app-chart [data]="chartData"></app-chart>
                </div>

                <div class="manage-section">
                    <div class="section-header">
                        <h3>📋 Manage Questions</h3>
                        <div class="search-box">
                            <span class="search-icon">🔍</span>
                            <input 
                                type="text" 
                                [(ngModel)]="searchTerm" 
                                placeholder="Search questions..." 
                                class="search-input">
                        </div>
                    </div>
                    
                    <div *ngIf="loadingQuestions" class="loading">
                        <div class="spinner"></div>
                        <p>Loading questions...</p>
                    </div>
                    
                    <div *ngIf="!loadingQuestions && filteredQuestions.length === 0" class="empty-state">
                        <div class="empty-icon">📭</div>
                        <p>No questions found.</p>
                    </div>
                    
                    <div class="questions-table-wrapper">
                        <table class="admin-table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Author</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr *ngFor="let q of filteredQuestions">
                                    <td data-label="Title">
                                        <a [routerLink]="['/questions', q._id]" class="question-link">
                                            {{ q.title | truncate:60 }}
                                        </a>
                                    </td>
                                    <td data-label="Author">{{ q.authorId.name || 'Unknown' }}</td>
                                    <td data-label="Created">{{ q.createdAt | date:'mediumDate' }}</td>
                                    <td data-label="Actions">
                                        <button class="delete-btn" 
                                                (click)="deleteQuestion(q._id)" 
                                                [disabled]="isDeleting === q._id">
                                            {{ isDeleting === q._id ? '...' : 'Delete' }}
                                        </button>
                                    </td>
                                 </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <style>
            .admin-page {
                background: var(--bg-light);
                min-height: 100vh;
                padding: 60px 0;
            }
            
            .admin-hero {
                text-align: center;
                max-width: 700px;
                margin: 0 auto 48px;
            }
            
            .admin-badge {
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
            
            .admin-hero h1 {
                font-size: clamp(2rem, 5vw, 3rem);
                font-weight: 800;
                margin-bottom: 16px;
                color: var(--dark);
            }
            
            .admin-hero h1 span {
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
            
            .alert-success {
                background-color: #ecfdf5;
                color: var(--secondary);
                border: 1px solid #a7f3d0;
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
            
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                gap: 20px;
                margin-bottom: 32px;
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
                box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            }
            
            .stat-icon {
                font-size: 32px;
                margin-bottom: 12px;
            }
            
            .stat-value {
                font-size: 36px;
                font-weight: 800;
                color: var(--primary);
            }
            
            .stat-label {
                font-size: 13px;
                color: var(--gray);
                margin-top: 4px;
            }
            
            .actions-card {
                background: white;
                border-radius: 20px;
                padding: 24px;
                margin-bottom: 32px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            }
            
            .actions-header h3 {
                margin-bottom: 8px;
                font-size: 18px;
            }
            
            .actions-header p {
                color: var(--gray);
                font-size: 13px;
                margin-bottom: 20px;
            }
            
            .button-group {
                display: flex;
                gap: 16px;
                flex-wrap: wrap;
            }
            
            .btn {
                padding: 12px 24px;
                border: none;
                border-radius: 40px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
                color: white;
            }
            
            .btn-success {
                background: var(--secondary);
            }
            
            .btn-success:hover:not(:disabled) {
                background: #059669;
                transform: translateY(-2px);
            }
            
            .btn-danger {
                background: var(--danger);
            }
            
            .btn-danger:hover:not(:disabled) {
                background: var(--danger-dark);
                transform: translateY(-2px);
            }
            
            .btn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }
            
            .warning {
                font-size: 12px;
                color: var(--warning);
                margin-top: 16px;
            }
            
            .chart-section {
                margin-bottom: 32px;
            }
            
            .manage-section {
                background: white;
                border-radius: 20px;
                padding: 24px;
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
                font-size: 18px;
            }
            
            .search-box {
                position: relative;
                min-width: 250px;
            }
            
            .search-icon {
                position: absolute;
                left: 12px;
                top: 50%;
                transform: translateY(-50%);
                font-size: 14px;
                opacity: 0.6;
            }
            
            .search-input {
                width: 100%;
                padding: 10px 12px 10px 36px;
                border: 2px solid var(--gray-lighter);
                border-radius: 40px;
                font-size: 14px;
                transition: all 0.2s;
            }
            
            .search-input:focus {
                outline: none;
                border-color: var(--primary);
            }
            
            .questions-table-wrapper {
                overflow-x: auto;
            }
            
            .admin-table {
                width: 100%;
                border-collapse: collapse;
            }
            
            .admin-table th,
            .admin-table td {
                padding: 14px 16px;
                text-align: left;
                border-bottom: 1px solid var(--gray-lighter);
            }
            
            .admin-table th {
                background: var(--bg-light);
                font-weight: 600;
                font-size: 13px;
                color: var(--gray-dark);
            }
            
            .admin-table tr:hover {
                background: var(--bg-light);
            }
            
            .question-link {
                color: var(--primary);
                text-decoration: none;
                font-weight: 500;
            }
            
            .question-link:hover {
                text-decoration: underline;
            }
            
            .delete-btn {
                padding: 6px 14px;
                background: var(--danger);
                color: white;
                border: none;
                border-radius: 20px;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.2s;
            }
            
            .delete-btn:hover:not(:disabled) {
                background: var(--danger-dark);
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
            
            @media (max-width: 768px) {
                .admin-page {
                    padding: 40px 0;
                }
                
                .stats-grid {
                    grid-template-columns: repeat(2, 1fr);
                    gap: 12px;
                }
                
                .stat-value {
                    font-size: 28px;
                }
                
                .button-group {
                    flex-direction: column;
                }
                
                .btn {
                    width: 100%;
                    text-align: center;
                }
                
                .admin-table th {
                    display: none;
                }
                
                .admin-table td {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid var(--gray-lighter);
                }
                
                .admin-table td:before {
                    content: attr(data-label);
                    font-weight: 600;
                    width: 40%;
                }
            }
        </style>
    `
})
export class AdminComponent implements OnInit {
    questions: Question[] = [];
    totalAnswers = 0;
    totalUsers = 0;
    totalTags = 0;
    chartData = { labels: [] as string[], values: [] as number[] };
    loadingQuestions = false;
    isSeeding = false;
    isClearing = false;
    isDeleting: string | null = null;
    searchTerm = '';
    errorMessage: string | null = null;
    successMessage: string | null = null;

    constructor(
        private questionService: QuestionService,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        this.loadQuestions();
    }

    get filteredQuestions(): Question[] {
        if (!this.searchTerm) return this.questions;
        return this.questions.filter(q =>
            q.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            q.content?.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
    }

    loadQuestions(): void {
        this.loadingQuestions = true;
        this.questionService.getAllQuestions(1, '', '').subscribe({
            next: (res) => {
                this.questions = res.questions;
                // Calculate total answers (answers are not in Question model)
                this.totalAnswers = 0; // Will be calculated from answer service if needed
                this.totalUsers = new Set(this.questions.map(q => q.authorId?._id)).size;
                this.totalTags = new Set(this.questions.flatMap(q => q.tags)).size;
                this.updateChart();
                this.loadingQuestions = false;
            },
            error: () => {
                this.loadingQuestions = false;
            }
        });
    }

    updateChart(): void {
        const userCount = new Map<string, number>();
        this.questions.forEach(q => {
            const authorName = q.authorId?.name || 'Unknown';
            userCount.set(authorName, (userCount.get(authorName) || 0) + 1);
        });
        const sorted = Array.from(userCount.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8);
        this.chartData = {
            labels: sorted.map(item => item[0]),
            values: sorted.map(item => item[1])
        };
    }

    deleteQuestion(id: string): void {
        if (confirm('Are you sure you want to delete this question? This action cannot be undone.')) {
            this.isDeleting = id;
            this.questionService.deleteQuestion(id).subscribe({
                next: () => {
                    this.successMessage = 'Question deleted successfully';
                    this.loadQuestions();
                    this.isDeleting = null;
                },
                error: () => {
                    this.errorMessage = 'Failed to delete question';
                    this.isDeleting = null;
                }
            });
        }
    }

    seedDatabase(): void {
        if (confirm('This will populate the database with sample data. Continue?')) {
            this.isSeeding = true;
            this.errorMessage = null;
            
            fetch(`${environment.apiUrl}/db/seed`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${this.authService.getToken()}` }
            }).then(response => {
                if (response.ok) {
                    this.successMessage = 'Database seeded successfully!';
                    this.loadQuestions();
                } else {
                    throw new Error('Failed to seed database');
                }
            }).catch(() => {
                this.errorMessage = 'Failed to seed database. Make sure you are logged in as admin.';
            }).finally(() => {
                this.isSeeding = false;
            });
        }
    }

    clearDatabase(): void {
        if (confirm('⚠️ WARNING: This will delete ALL data from the database. This action cannot be undone. Continue?')) {
            this.isClearing = true;
            this.errorMessage = null;
            
            fetch(`${environment.apiUrl}/db/clear`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${this.authService.getToken()}` }
            }).then(response => {
                if (response.ok) {
                    this.successMessage = 'Database cleared successfully!';
                    this.loadQuestions();
                } else {
                    throw new Error('Failed to clear database');
                }
            }).catch(() => {
                this.errorMessage = 'Failed to clear database. Make sure you are logged in as admin.';
            }).finally(() => {
                this.isClearing = false;
            });
        }
    }
}