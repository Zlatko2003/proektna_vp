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
                        🛡️ Admin Panel
                    </div>
                    <h1>Dashboard</h1>
                    <p class="hero-description">
                        Manage your platform, monitor activity, and control database operations.
                    </p>
                </div>

                <div class="alert alert-error" *ngIf="errorMessage">
                    <span>⚠️ {{ errorMessage }}</span>
                    <button class="close-btn" (click)="errorMessage = null">×</button>
                </div>
                
                <div class="alert alert-success" *ngIf="successMessage">
                    <span>✅ {{ successMessage }}</span>
                    <button class="close-btn" (click)="successMessage = null">×</button>
                </div>

                <div class="two-column-layout">
                    <div class="col-6">
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

                        <div class="chart-section" *ngIf="chartData.labels.length">
                            <div class="chart-header">
                                <h3>📊 Daily Activity</h3>
                                <div class="chart-tabs">
                                    <button class="chart-tab-btn" 
                                            [class.active]="chartType === 'questions'"
                                            (click)="setChartType('questions')">
                                        📝 Questions
                                    </button>
                                    <button class="chart-tab-btn" 
                                            [class.active]="chartType === 'users'"
                                            (click)="setChartType('users')">
                                        👥 Users
                                    </button>
                                </div>
                            </div>
                            
                            <div class="chart-filters">
                                <button class="filter-btn" 
                                        [class.active]="chartFilter === 'daily'"
                                        (click)="setChartFilter('daily')">
                                    Daily
                                </button>
                                <button class="filter-btn" 
                                        [class.active]="chartFilter === 'weekly'"
                                        (click)="setChartFilter('weekly')">
                                    Weekly
                                </button>
                                <button class="filter-btn" 
                                        [class.active]="chartFilter === 'monthly'"
                                        (click)="setChartFilter('monthly')">
                                    Monthly
                                </button>
                                <button class="filter-btn" 
                                        [class.active]="chartFilter === 'yearly'"
                                        (click)="setChartFilter('yearly')">
                                    Yearly
                                </button>
                            </div>
                            
                            <div class="chart-info">
                                <span class="chart-total">
                                    Total {{ chartType === 'questions' ? 'Questions' : 'Users' }}: 
                                    <strong>{{ chartTotal }}</strong>
                                </span>
                                <span class="chart-period">
                                    {{ chartPeriod }}
                                </span>
                            </div>
                            
                            <app-chart [data]="chartData"></app-chart>
                        </div>
                    </div>

                    <div class="col-6">
                        <div class="manage-section">
                            <div class="tabs">
                                <button class="tab-btn" 
                                        [class.active]="activeTab === 'questions'"
                                        (click)="activeTab = 'questions'">
                                    📋 Questions
                                    <span class="tab-badge">{{ filteredQuestions.length }}</span>
                                </button>
                                <button class="tab-btn" 
                                        [class.active]="activeTab === 'users'"
                                        (click)="activeTab = 'users'">
                                    👥 Users
                                    <span class="tab-badge">{{ usersList.length }}</span>
                                </button>
                            </div>

                            <div class="search-box" *ngIf="activeTab === 'questions'">
                                <span class="search-icon">🔍</span>
                                <input 
                                    type="text" 
                                    [(ngModel)]="searchTerm" 
                                    placeholder="Search questions..." 
                                    class="search-input">
                                <button *ngIf="searchTerm" class="clear-search" (click)="searchTerm = ''">✕</button>
                            </div>
                            
                            <div *ngIf="activeTab === 'questions'">
                                <div *ngIf="loadingQuestions" class="loading">
                                    <div class="spinner"></div>
                                    <p>Loading questions...</p>
                                </div>
                                
                                <div *ngIf="!loadingQuestions && filteredQuestions.length === 0" class="empty-state">
                                    <div class="empty-icon">📭</div>
                                    <p *ngIf="!searchTerm">No questions found.</p>
                                    <p *ngIf="searchTerm">No questions match your search.</p>
                                </div>
                                
                                <div class="questions-table-wrapper" *ngIf="!loadingQuestions && filteredQuestions.length > 0">
                                    <table class="admin-table">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Title</th>
                                                <th>Author</th>
                                                <th>Created</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr *ngFor="let q of filteredQuestions; let i = index">
                                                <td data-label="#" class="row-number">{{ i + 1 }}</td>
                                                <td data-label="Title">
                                                    <a [routerLink]="['/questions', q._id]" class="question-link">
                                                        {{ q.title | slice:0:50 }}{{ q.title.length > 50 ? '...' : '' }}
                                                    </a>
                                                </td>
                                                <td data-label="Author">
                                                    <span class="author-badge">{{ q.authorId.name || 'Unknown' }}</span>
                                                </td>
                                                <td data-label="Created" class="date-cell">
                                                    {{ q.createdAt | date:'MMM d, yyyy' }}
                                                </td>
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

                            <div *ngIf="activeTab === 'users'">
                                <div *ngIf="loadingUsers" class="loading">
                                    <div class="spinner"></div>
                                    <p>Loading users...</p>
                                </div>
                                
                                <div *ngIf="!loadingUsers && usersList.length === 0" class="empty-state">
                                    <div class="empty-icon">👤</div>
                                    <p>No users found.</p>
                                </div>
                                
                                <div class="questions-table-wrapper" *ngIf="!loadingUsers && usersList.length > 0">
                                    <table class="admin-table">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Name</th>
                                                <th>Questions</th>
                                                <th>Joined</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr *ngFor="let user of usersList; let i = index">
                                                <td data-label="#" class="row-number">{{ i + 1 }}</td>
                                                <td data-label="Name">
                                                    <span class="author-badge">{{ user.name }}</span>
                                                </td>
                                                <td data-label="Questions" class="answer-count">
                                                    {{ user.questionCount }}
                                                </td>
                                                <td data-label="Joined" class="date-cell">
                                                    {{ user.joinedAt | date:'MMM d, yyyy' }}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="database-actions">
                    <div class="database-header">
                        <h3>🗄️ Database Management</h3>
                        <p>Seed or clear the database with sample data.</p>
                    </div>
                    <div class="database-buttons">
                        <button class="btn btn-success" (click)="seedDatabase()" [disabled]="isSeeding">
                            🌱 {{ isSeeding ? 'Seeding...' : 'Seed Database' }}
                        </button>
                        <button class="btn btn-danger" (click)="clearDatabase()" [disabled]="isClearing">
                            🗑️ {{ isClearing ? 'Clearing...' : 'Clear Database' }}
                        </button>
                    </div>
                    <div class="warning">⚠️ These actions will modify the database.</div>
                </div>
            </div>
        </div>
        <style>
            .admin-page {
                background: #f8fafc;
                min-height: 100vh;
                padding: 40px 0;
            }
            
            .admin-hero {
                text-align: center;
                max-width: 500px;
                margin: 0 auto 32px;
            }
            
            .admin-badge {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                padding: 4px 14px;
                margin-bottom: 12px;
                background: rgba(99,102,241,.1);
                border-radius: 999px;
                color: #6366f1;
                font-size: 12px;
                font-weight: 600;
                border: 1px solid rgba(99,102,241,.1);
            }
            
            .admin-hero h1 {
                font-size: clamp(1.5rem, 3vw, 2.5rem);
                font-weight: 800;
                margin-bottom: 8px;
                color: #0f172a;
            }
            
            .hero-description {
                font-size: 0.95rem;
                color: #64748b;
                max-width: 400px;
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
            }
            
            .alert-error {
                background: #fef2f2;
                color: #dc2626;
                border: 1px solid #fecaca;
            }
            
            .alert-success {
                background: #ecfdf5;
                color: #059669;
                border: 1px solid #a7f3d0;
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
            
            .two-column-layout {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 24px;
                margin-bottom: 32px;
            }
            
            .col-6 {
                min-width: 0;
                width: 100%;
            }
            
            .stats-grid {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr 1fr;
                gap: 12px;
                margin-bottom: 16px;
            }
            
            .stat-card {
                background: white;
                border-radius: 12px;
                padding: 14px 12px;
                text-align: center;
                box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                transition: all 0.3s ease;
                border: 1px solid rgba(0,0,0,0.03);
            }
            
            .stat-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 20px rgba(99,102,241,.1);
            }
            
            .stat-icon {
                font-size: 20px;
                margin-bottom: 2px;
                display: block;
            }
            
            .stat-value {
                font-size: 22px;
                font-weight: 800;
                color: #6366f1;
                display: block;
                line-height: 1.2;
            }
            
            .stat-label {
                font-size: 11px;
                color: #94a3b8;
                margin-top: 2px;
                display: block;
                font-weight: 500;
            }
            
            .chart-section {
                background: white;
                border-radius: 16px;
                padding: 18px 20px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                border: 1px solid rgba(0,0,0,0.03);
            }
            
            .chart-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
                padding-bottom: 10px;
                border-bottom: 1px solid #f1f5f9;
                flex-wrap: wrap;
                gap: 10px;
            }
            
            .chart-header h3 {
                font-size: 15px;
                font-weight: 700;
                color: #0f172a;
            }
            
            .chart-tabs {
                display: flex;
                gap: 4px;
                background: #f1f5f9;
                padding: 3px;
                border-radius: 8px;
            }
            
            .chart-tab-btn {
                padding: 4px 12px;
                border: none;
                border-radius: 6px;
                font-size: 11px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                background: transparent;
                color: #64748b;
            }
            
            .chart-tab-btn:hover {
                color: #0f172a;
            }
            
            .chart-tab-btn.active {
                background: white;
                color: #6366f1;
                box-shadow: 0 1px 4px rgba(0,0,0,0.05);
            }
            
            .chart-filters {
                display: flex;
                gap: 4px;
                margin-bottom: 12px;
                background: #f8fafc;
                padding: 3px;
                border-radius: 8px;
                width: fit-content;
            }
            
            .filter-btn {
                padding: 3px 10px;
                border: none;
                border-radius: 6px;
                font-size: 11px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.3s ease;
                background: transparent;
                color: #94a3b8;
            }
            
            .filter-btn:hover {
                color: #0f172a;
            }
            
            .filter-btn.active {
                background: white;
                color: #6366f1;
                box-shadow: 0 1px 4px rgba(0,0,0,0.05);
            }
            
            .chart-info {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
                padding: 8px 12px;
                background: #f8fafc;
                border-radius: 8px;
                font-size: 13px;
                color: #64748b;
            }
            
            .chart-total {
                font-weight: 500;
            }
            
            .chart-total strong {
                color: #6366f1;
                font-size: 16px;
            }
            
            .chart-period {
                font-weight: 500;
                color: #94a3b8;
            }
            
            .manage-section {
                background: white;
                border-radius: 16px;
                padding: 18px 20px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                border: 1px solid rgba(0,0,0,0.03);
                height: 100%;
                display: flex;
                flex-direction: column;
            }
            
            .tabs {
                display: flex;
                gap: 4px;
                margin-bottom: 16px;
                background: #f1f5f9;
                padding: 4px;
                border-radius: 12px;
            }
            
            .tab-btn {
                flex: 1;
                padding: 8px 16px;
                border: none;
                border-radius: 10px;
                font-size: 13px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                background: transparent;
                color: #64748b;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }
            
            .tab-btn:hover {
                background: rgba(255,255,255,0.5);
                color: #0f172a;
            }
            
            .tab-btn.active {
                background: white;
                color: #6366f1;
                box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            }
            
            .tab-badge {
                background: #eef2ff;
                color: #6366f1;
                padding: 1px 8px;
                border-radius: 999px;
                font-size: 11px;
                font-weight: 600;
            }
            
            .tab-btn.active .tab-badge {
                background: #6366f1;
                color: white;
            }
            
            .search-box {
                position: relative;
                margin-bottom: 16px;
            }
            
            .search-icon {
                position: absolute;
                left: 12px;
                top: 50%;
                transform: translateY(-50%);
                font-size: 14px;
                opacity: 0.5;
            }
            
            .search-input {
                width: 100%;
                padding: 8px 36px 8px 36px;
                border: 2px solid #f1f5f9;
                border-radius: 40px;
                font-size: 13px;
                transition: all 0.3s ease;
                background: #f8fafc;
                color: #0f172a;
            }
            
            .search-input:focus {
                outline: none;
                border-color: #6366f1;
                background: white;
                box-shadow: 0 0 0 4px rgba(99,102,241,.1);
            }
            
            .clear-search {
                position: absolute;
                right: 10px;
                top: 50%;
                transform: translateY(-50%);
                background: none;
                border: none;
                color: #94a3b8;
                cursor: pointer;
                font-size: 13px;
                padding: 2px 6px;
                border-radius: 50%;
                transition: all 0.2s;
            }
            
            .clear-search:hover {
                background: #f1f5f9;
                color: #475569;
            }
            
            .questions-table-wrapper {
                overflow-x: auto;
                flex: 1;
                border-radius: 10px;
                border: 1px solid #f1f5f9;
            }
            
            .admin-table {
                width: 100%;
                border-collapse: collapse;
                font-size: 13px;
            }
            
            .admin-table thead th {
                padding: 10px 12px;
                text-align: left;
                background: #f8fafc;
                font-weight: 600;
                font-size: 11px;
                color: #64748b;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                border-bottom: 2px solid #f1f5f9;
            }
            
            .admin-table tbody td {
                padding: 10px 12px;
                border-bottom: 1px solid #f1f5f9;
                color: #0f172a;
                vertical-align: middle;
            }
            
            .admin-table tbody tr:last-child td {
                border-bottom: none;
            }
            
            .admin-table tbody tr:hover {
                background: #f8fafc;
            }
            
            .row-number {
                font-weight: 600;
                color: #94a3b8;
                font-size: 12px;
                width: 30px;
            }
            
            .question-link {
                color: #6366f1;
                text-decoration: none;
                font-weight: 500;
                transition: all 0.2s;
                font-size: 13px;
            }
            
            .question-link:hover {
                color: #4f46e5;
                text-decoration: underline;
            }
            
            .author-badge {
                background: #f1f5f9;
                padding: 2px 10px;
                border-radius: 999px;
                font-size: 12px;
                font-weight: 500;
                color: #475569;
                display: inline-block;
            }
            
            .answer-count {
                font-weight: 600;
                color: #6366f1;
                text-align: center;
            }
            
            .date-cell {
                font-size: 12px;
                color: #64748b;
            }
            
            .delete-btn {
                padding: 4px 14px;
                background: #fee2e2;
                color: #dc2626;
                border: none;
                border-radius: 16px;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.2s;
            }
            
            .delete-btn:hover:not(:disabled) {
                background: #fecaca;
                transform: scale(1.05);
            }
            
            .delete-btn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }
            
            .loading {
                text-align: center;
                padding: 30px 10px;
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
            
            .loading p {
                font-size: 13px;
                color: #94a3b8;
            }
            
            .empty-state {
                text-align: center;
                padding: 40px 10px;
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }
            
            .empty-icon {
                font-size: 36px;
                margin-bottom: 12px;
                opacity: 0.5;
            }
            
            .empty-state p {
                color: #94a3b8;
                font-size: 14px;
            }
            
            .database-actions {
                background: white;
                border-radius: 16px;
                padding: 24px 28px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                border: 1px solid rgba(0,0,0,0.03);
                margin-top: 8px;
            }
            
            .database-header h3 {
                font-size: 16px;
                font-weight: 700;
                color: #0f172a;
                margin-bottom: 2px;
            }
            
            .database-header p {
                color: #94a3b8;
                font-size: 13px;
                margin-bottom: 16px;
            }
            
            .database-buttons {
                display: flex;
                gap: 12px;
                flex-wrap: wrap;
            }
            
            .btn {
                padding: 10px 24px;
                border: none;
                border-radius: 40px;
                font-size: 13px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                color: white;
            }
            
            .btn-success {
                background: linear-gradient(135deg, #10b981, #059669);
                box-shadow: 0 4px 15px rgba(16,185,129,.3);
            }
            
            .btn-success:hover:not(:disabled) {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(16,185,129,.4);
            }
            
            .btn-danger {
                background: linear-gradient(135deg, #ef4444, #dc2626);
                box-shadow: 0 4px 15px rgba(239,68,68,.3);
            }
            
            .btn-danger:hover:not(:disabled) {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(239,68,68,.4);
            }
            
            .btn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                transform: none !important;
            }
            
            .warning {
                font-size: 11px;
                color: #f59e0b;
                margin-top: 12px;
                background: #fffbeb;
                padding: 6px 14px;
                border-radius: 6px;
                display: inline-block;
                border: 1px solid #fde68a;
            }
            
            @media (max-width: 1024px) {
                .two-column-layout {
                    grid-template-columns: 1fr;
                    gap: 20px;
                }
            }
            
            @media (max-width: 768px) {
                .admin-page {
                    padding: 24px 0;
                }
                
                .admin-hero {
                    margin-bottom: 24px;
                }
                
                .stats-grid {
                    grid-template-columns: 1fr 1fr;
                    gap: 10px;
                }
                
                .stat-value {
                    font-size: 20px;
                }
                
                .stat-card {
                    padding: 12px 10px;
                }
                
                .stat-icon {
                    font-size: 18px;
                }
                
                .database-buttons {
                    flex-direction: column;
                }
                
                .btn {
                    width: 100%;
                    text-align: center;
                }
                
                .manage-section {
                    padding: 14px 16px;
                }
                
                .chart-header {
                    flex-direction: column;
                    align-items: stretch;
                }
                
                .chart-tabs {
                    width: 100%;
                }
                
                .chart-tab-btn {
                    flex: 1;
                    text-align: center;
                }
                
                .chart-filters {
                    width: 100%;
                    justify-content: stretch;
                }
                
                .filter-btn {
                    flex: 1;
                    text-align: center;
                }
                
                .chart-info {
                    flex-direction: column;
                    gap: 4px;
                    text-align: center;
                }
                
                .admin-table thead {
                    display: none;
                }
                
                .admin-table tbody td {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px 12px;
                    border-bottom: 1px solid #f1f5f9;
                }
                
                .admin-table tbody td:before {
                    content: attr(data-label);
                    font-weight: 600;
                    color: #64748b;
                    font-size: 11px;
                    width: 35%;
                    flex-shrink: 0;
                }
                
                .admin-table tbody tr:last-child td {
                    border-bottom: 1px solid #f1f5f9;
                }
                
                .admin-table tbody tr:last-child td:last-child {
                    border-bottom: none;
                }
                
                .row-number {
                    display: none;
                }
                
                .database-actions {
                    padding: 18px 20px;
                }
            }
            
            @media (max-width: 480px) {
                .stats-grid {
                    grid-template-columns: 1fr 1fr;
                    gap: 8px;
                }
                
                .stat-value {
                    font-size: 18px;
                }
                
                .stat-icon {
                    font-size: 16px;
                }
            }
        </style>
    `
})
export class AdminComponent implements OnInit {
    questions: Question[] = [];
    usersList: any[] = [];
    totalAnswers = 0;
    totalUsers = 0;
    totalTags = 0;
    chartData = { labels: [] as string[], values: [] as number[] };
    chartType: 'questions' | 'users' = 'questions';
    chartFilter: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'weekly';
    chartTotal = 0;
    chartPeriod = '';
    loadingQuestions = false;
    loadingUsers = false;
    isSeeding = false;
    isClearing = false;
    isDeleting: string | null = null;
    searchTerm = '';
    activeTab: 'questions' | 'users' = 'questions';
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
        const term = this.searchTerm.toLowerCase();
        return this.questions.filter(q =>
            q.title.toLowerCase().includes(term) ||
            (q.content?.toLowerCase().includes(term)) ||
            (q.authorId?.name?.toLowerCase().includes(term)) ||
            q.tags?.some(t => t.toLowerCase().includes(term))
        );
    }

    loadQuestions(): void {
        this.loadingQuestions = true;
        this.questionService.getAllQuestions(1, '', '').subscribe({
            next: (res) => {
                this.questions = res.questions;
                this.totalAnswers = this.questions.reduce((sum, q) => sum + ((q as any).answerCount || 0), 0);
                const uniqueUsers = new Set(this.questions.map(q => q.authorId?._id).filter(id => id));
                this.totalUsers = uniqueUsers.size;
                const allTags = new Set(this.questions.flatMap(q => q.tags || []));
                this.totalTags = allTags.size;
                this.buildUsersList();
                this.updateChart();
                this.loadingQuestions = false;
            },
            error: () => {
                this.loadingQuestions = false;
            }
        });
    }

    buildUsersList(): void {
        const userMap = new Map<string, { name: string; questionCount: number; joinedAt: Date }>();
        this.questions.forEach(q => {
            if (q.authorId?._id) {
                const existing = userMap.get(q.authorId._id);
                if (existing) {
                    existing.questionCount++;
                } else {
                    userMap.set(q.authorId._id, {
                        name: q.authorId.name || 'Unknown',
                        questionCount: 1,
                        joinedAt: q.createdAt || new Date()
                    });
                }
            }
        });
        this.usersList = Array.from(userMap.entries()).map(([id, data]) => ({
            id,
            ...data
        }));
        this.totalUsers = this.usersList.length;
    }

    setChartType(type: 'questions' | 'users'): void {
        this.chartType = type;
        this.updateChart();
    }

    setChartFilter(filter: 'daily' | 'weekly' | 'monthly' | 'yearly'): void {
        this.chartFilter = filter;
        this.updateChart();
    }

    updateChart(): void {
        const now = new Date();
        let startDate: Date;
        let groupBy: 'day' | 'week' | 'month' | 'year';
        let periodLabel: string;

        switch (this.chartFilter) {
            case 'daily':
                startDate = new Date(now);
                startDate.setDate(now.getDate() - 7);
                groupBy = 'day';
                periodLabel = 'Last 7 days';
                break;
            case 'weekly':
                startDate = new Date(now);
                startDate.setDate(now.getDate() - 28);
                groupBy = 'week';
                periodLabel = 'Last 4 weeks';
                break;
            case 'monthly':
                startDate = new Date(now);
                startDate.setMonth(now.getMonth() - 6);
                groupBy = 'month';
                periodLabel = 'Last 6 months';
                break;
            case 'yearly':
                startDate = new Date(now);
                startDate.setFullYear(now.getFullYear() - 2);
                groupBy = 'year';
                periodLabel = 'Last 2 years';
                break;
            default:
                startDate = new Date(now);
                startDate.setDate(now.getDate() - 28);
                groupBy = 'week';
                periodLabel = 'Last 4 weeks';
        }

        this.chartPeriod = periodLabel;

        const dateMap = new Map<string, number>();
        let total = 0;

        if (this.chartType === 'questions') {
            this.questions.forEach(q => {
                const date = new Date(q.createdAt);
                if (date >= startDate) {
                    let key: string;
                    switch (groupBy) {
                        case 'day':
                            key = date.toLocaleDateString('en-US', { weekday: 'short' });
                            break;
                        case 'week':
                            const weekStart = new Date(date);
                            weekStart.setDate(date.getDate() - date.getDay());
                            key = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                            break;
                        case 'month':
                            key = date.toLocaleDateString('en-US', { month: 'short' });
                            break;
                        case 'year':
                            key = date.getFullYear().toString();
                            break;
                        default:
                            key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    }
                    dateMap.set(key, (dateMap.get(key) || 0) + 1);
                    total++;
                }
            });
        } else {
            this.usersList.forEach(user => {
                const date = new Date(user.joinedAt);
                if (date >= startDate) {
                    let key: string;
                    switch (groupBy) {
                        case 'day':
                            key = date.toLocaleDateString('en-US', { weekday: 'short' });
                            break;
                        case 'week':
                            const weekStart = new Date(date);
                            weekStart.setDate(date.getDate() - date.getDay());
                            key = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                            break;
                        case 'month':
                            key = date.toLocaleDateString('en-US', { month: 'short' });
                            break;
                        case 'year':
                            key = date.getFullYear().toString();
                            break;
                        default:
                            key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    }
                    dateMap.set(key, (dateMap.get(key) || 0) + 1);
                    total++;
                }
            });
        }

        this.chartTotal = total;

        const sortedKeys = Array.from(dateMap.keys()).sort((a, b) => {
            if (groupBy === 'day') {
                const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                return days.indexOf(a) - days.indexOf(b);
            }
            if (groupBy === 'month') {
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                return months.indexOf(a) - months.indexOf(b);
            }
            if (groupBy === 'year') {
                return parseInt(a) - parseInt(b);
            }
            return a.localeCompare(b);
        });

        this.chartData = {
            labels: sortedKeys,
            values: sortedKeys.map(key => dateMap.get(key) || 0)
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
                    setTimeout(() => this.successMessage = null, 3000);
                },
                error: () => {
                    this.errorMessage = 'Failed to delete question';
                    this.isDeleting = null;
                    setTimeout(() => this.errorMessage = null, 3000);
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
                    setTimeout(() => this.successMessage = null, 3000);
                } else {
                    throw new Error('Failed to seed database');
                }
            }).catch(() => {
                this.errorMessage = 'Failed to seed database. Make sure you are logged in as admin.';
                setTimeout(() => this.errorMessage = null, 3000);
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
                    setTimeout(() => this.successMessage = null, 3000);
                } else {
                    throw new Error('Failed to clear database');
                }
            }).catch(() => {
                this.errorMessage = 'Failed to clear database. Make sure you are logged in as admin.';
                setTimeout(() => this.errorMessage = null, 3000);
            }).finally(() => {
                this.isClearing = false;
            });
        }
    }
}