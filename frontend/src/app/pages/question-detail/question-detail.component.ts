import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionService } from '../../services/question.service';
import { AnswerService } from '../../services/answer.service';
import { AuthService } from '../../services/auth.service';
import { Question } from '../../models/question.model';
import { Answer } from '../../models/answer.model';

@Component({
    selector: 'app-question-detail',
    template: `
        <div class="question-detail-page">
            <div class="container" *ngIf="question">
                <div class="back-nav">
                    <a routerLink="/questions" class="back-link">
                        ← Back to Questions
                    </a>
                </div>

                <div class="two-column-layout">
                    <!-- Left Column: Question + Answers (col-8) -->
                    <div class="main-content">
                        <div class="question-card">
                            <div class="question-badge">
                                📌 Question
                            </div>
                            <h1>{{ question.title }}</h1>
                            
                            <div class="question-meta-info">
                                <div class="meta-item">
                                    <span class="meta-icon">👤</span>
                                    Asked by <strong>{{ question.authorId.name }}</strong>
                                </div>
                                <div class="meta-item">
                                    <span class="meta-icon">📅</span>
                                    {{ question.createdAt | date:'MMMM d, yyyy' }}
                                </div>
                                <div class="meta-item">
                                    <span class="meta-icon">👁️</span>
                                    {{ question.views }} views
                                </div>
                            </div>
                            
                            <div class="question-content">
                                {{ question.content }}
                            </div>
                            
                            <div class="tags-section">
                                <span class="tag" *ngFor="let tag of question.tags">
                                    #{{ tag }}
                                </span>
                            </div>
                        </div>
                        
                        <div class="answers-section">
                            <div class="answers-header">
                                <h3>
                                    💬 {{ answers.length }} 
                                    {{ answers.length === 1 ? 'Answer' : 'Answers' }}
                                </h3>
                                <div class="sort-control" (click)="toggleSort()">
                                    Sort by: {{ sortByVotes ? 'Most Votes ↓' : 'Newest First ↓' }}
                                </div>
                            </div>
                            
                            <div class="answers-list">
                                <div class="answer-card" 
                                     *ngFor="let answer of sortedAnswers" 
                                     [class.accepted]="answer.isAccepted">
                                    <div class="answer-voting">
                                        <button class="vote-btn upvote" 
                                                (click)="vote(answer._id, 'up')"
                                                [disabled]="!isAuthenticated">
                                            ▲
                                        </button>
                                        <span class="vote-count">{{ answer.votes }}</span>
                                        <button class="vote-btn downvote" 
                                                (click)="vote(answer._id, 'down')"
                                                [disabled]="!isAuthenticated">
                                            ▼
                                        </button>
                                        <div class="accepted-badge" *ngIf="answer.isAccepted">
                                            ✓ Accepted
                                        </div>
                                    </div>
                                    
                                    <div class="answer-content">
                                        <div class="answer-text">{{ answer.content }}</div>
                                        <div class="answer-footer">
                                            <div class="answer-author">
                                                <span class="author-avatar">
                                                    {{ answer.authorId.name.charAt(0) || '?' }}
                                                </span>
                                                <span class="author-name">{{ answer.authorId.name }}</span>
                                                <span class="answer-date">
                                                    answered {{ answer.createdAt | date:'MMM d, yyyy' }}
                                                </span>
                                            </div>
                                            <button *ngIf="isAuthor && !answer.isAccepted" 
                                                    class="accept-btn" 
                                                    (click)="acceptAnswer(answer._id)">
                                                ✓ Accept Answer
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="your-answer-card" *ngIf="isAuthenticated">
                                <h3>✍️ Your Answer</h3>
                                <textarea [(ngModel)]="newAnswer" 
                                          rows="6" 
                                          placeholder="Write your answer here..."></textarea>
                                <button class="submit-btn" (click)="postAnswer()">
                                    Post Answer
                                </button>
                            </div>
                            
                            <div class="login-prompt" *ngIf="!isAuthenticated">
                                <p>🔐 Please <a routerLink="/login">login</a> or <a routerLink="/register">register</a> to post an answer.</p>
                            </div>
                        </div>
                    </div>

                    <!-- Right Column: GitHub Repos (col-4) -->
                    <div class="sidebar-content">
                        <app-github-repos [tag]="question.tags[0]"></app-github-repos>
                        
                        <!-- Optional: Additional sidebar content -->
                        <div class="info-card">
                            <div class="info-header">
                                <span>ℹ️</span>
                                <h3>About DevQ&A</h3>
                            </div>
                            <div class="info-content">
                                <p>Ask questions, share knowledge, and connect with the developer community.</p>
                                <hr>
                                <div class="info-stats">
                                    <div class="info-stat">
                                        <span class="stat-value">{{ answers.length }}</span>
                                        <span class="stat-label">answers</span>
                                    </div>
                                    <div class="info-stat">
                                        <span class="stat-value">{{ question.views }}</span>
                                        <span class="stat-label">views</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <style>
            .question-detail-page {
                background: var(--bg-light);
                min-height: 100vh;
                padding: 40px 0;
            }
            
            .back-nav {
                margin-bottom: 24px;
            }
            
            .back-link {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                color: var(--gray);
                text-decoration: none;
                font-size: 14px;
                font-weight: 500;
                transition: color 0.2s;
            }
            
            .back-link:hover {
                color: var(--primary);
            }
            
            .two-column-layout {
                display: grid;
                grid-template-columns: 2fr 1fr;
                gap: 32px;
            }
            
            .main-content {
                min-width: 0;
            }
            
            .sidebar-content {
                position: sticky;
                top: 100px;
                align-self: start;
            }
            
            .question-card {
                background: white;
                border-radius: 24px;
                padding: 32px;
                margin-bottom: 32px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            }
            
            .question-badge {
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
            
            .question-card h1 {
                font-size: clamp(1.5rem, 5vw, 2.25rem);
                font-weight: 800;
                margin-bottom: 20px;
                color: var(--dark);
                line-height: 1.2;
            }
            
            .question-meta-info {
                display: flex;
                flex-wrap: wrap;
                gap: 20px;
                padding-bottom: 20px;
                margin-bottom: 20px;
                border-bottom: 1px solid var(--gray-lighter);
            }
            
            .meta-item {
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 13px;
                color: var(--gray);
            }
            
            .meta-icon {
                font-size: 14px;
            }
            
            .question-content {
                line-height: 1.7;
                font-size: 16px;
                color: var(--gray-dark);
                margin-bottom: 24px;
            }
            
            .tags-section {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                padding-top: 16px;
                border-top: 1px solid var(--gray-lighter);
            }
            
            .tag {
                background: var(--bg-light);
                padding: 6px 14px;
                border-radius: 999px;
                font-size: 13px;
                font-weight: 500;
                color: var(--gray-dark);
            }
            
            .answers-section {
                background: white;
                border-radius: 24px;
                padding: 32px;
            }
            
            .answers-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;
                gap: 16px;
                margin-bottom: 28px;
                padding-bottom: 16px;
                border-bottom: 1px solid var(--gray-lighter);
            }
            
            .answers-header h3 {
                font-size: 20px;
                font-weight: 700;
            }
            
            .sort-control {
                font-size: 13px;
                color: var(--primary);
                cursor: pointer;
                font-weight: 500;
            }
            
            .answer-card {
                display: flex;
                gap: 20px;
                padding: 24px 0;
                border-bottom: 1px solid var(--gray-lighter);
                transition: background 0.2s;
            }
            
            .answer-card:last-child {
                border-bottom: none;
            }
            
            .answer-card.accepted {
                background: linear-gradient(90deg, rgba(16,185,129,.05) 0%, transparent 100%);
                margin: 0 -24px;
                padding: 24px;
                border-radius: 16px;
            }
            
            .answer-voting {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 6px;
                min-width: 60px;
            }
            
            .vote-btn {
                background: none;
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: var(--gray-light);
                padding: 6px;
                transition: all 0.2s;
                border-radius: 8px;
            }
            
            .vote-btn:hover:not(:disabled) {
                transform: scale(1.1);
            }
            
            .vote-btn.upvote:hover:not(:disabled) {
                color: var(--secondary);
                background: rgba(16,185,129,.1);
            }
            
            .vote-btn.downvote:hover:not(:disabled) {
                color: var(--danger);
                background: rgba(239,68,68,.1);
            }
            
            .vote-count {
                font-size: 18px;
                font-weight: 700;
                color: var(--dark);
            }
            
            .accepted-badge {
                background: var(--secondary);
                color: white;
                padding: 4px 10px;
                border-radius: 20px;
                font-size: 11px;
                font-weight: 600;
                margin-top: 6px;
            }
            
            .answer-content {
                flex: 1;
            }
            
            .answer-text {
                line-height: 1.65;
                color: var(--gray-dark);
                margin-bottom: 16px;
            }
            
            .answer-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;
                gap: 16px;
            }
            
            .answer-author {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 13px;
            }
            
            .author-avatar {
                width: 28px;
                height: 28px;
                background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: 600;
                font-size: 12px;
            }
            
            .author-name {
                font-weight: 600;
                color: var(--dark);
            }
            
            .answer-date {
                color: var(--gray-light);
                font-size: 12px;
            }
            
            .accept-btn {
                background: var(--secondary);
                color: white;
                border: none;
                padding: 6px 14px;
                border-radius: 20px;
                cursor: pointer;
                font-size: 12px;
                font-weight: 500;
                transition: all 0.2s;
            }
            
            .accept-btn:hover {
                background: #059669;
                transform: translateY(-1px);
            }
            
            .your-answer-card {
                margin-top: 32px;
                padding-top: 24px;
                border-top: 1px solid var(--gray-lighter);
            }
            
            .your-answer-card h3 {
                margin-bottom: 16px;
                font-size: 18px;
            }
            
            textarea {
                width: 100%;
                padding: 16px;
                border: 2px solid var(--gray-lighter);
                border-radius: 16px;
                font-family: inherit;
                font-size: 14px;
                resize: vertical;
                transition: border 0.2s;
            }
            
            textarea:focus {
                outline: none;
                border-color: var(--primary);
            }
            
            .submit-btn {
                margin-top: 16px;
                padding: 12px 28px;
                background: var(--primary);
                color: white;
                border: none;
                border-radius: 40px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .submit-btn:hover {
                background: var(--primary-dark);
                transform: translateY(-2px);
            }
            
            .login-prompt {
                margin-top: 32px;
                padding: 32px;
                text-align: center;
                background: var(--bg-light);
                border-radius: 16px;
            }
            
            .login-prompt a {
                color: var(--primary);
                text-decoration: none;
                font-weight: 600;
            }
            
            /* Info Card for Sidebar */
            .info-card {
                background: white;
                border-radius: 20px;
                padding: 20px;
                margin-top: 24px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            }
            
            .info-header {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 16px;
                padding-bottom: 12px;
                border-bottom: 1px solid var(--gray-lighter);
            }
            
            .info-header span {
                font-size: 20px;
            }
            
            .info-header h3 {
                font-size: 16px;
                font-weight: 600;
                margin: 0;
            }
            
            .info-content p {
                font-size: 13px;
                color: var(--gray);
                line-height: 1.5;
                margin-bottom: 12px;
            }
            
            .info-content hr {
                margin: 12px 0;
                border: none;
                border-top: 1px solid var(--gray-lighter);
            }
            
            .info-stats {
                display: flex;
                gap: 16px;
            }
            
            .info-stat {
                flex: 1;
                text-align: center;
            }
            
            .info-stat .stat-value {
                display: block;
                font-size: 20px;
                font-weight: 700;
                color: var(--primary);
            }
            
            .info-stat .stat-label {
                font-size: 11px;
                color: var(--gray-light);
            }
            
            @media (max-width: 992px) {
                .two-column-layout {
                    grid-template-columns: 1fr;
                    gap: 24px;
                }
                
                .sidebar-content {
                    position: static;
                }
            }
            
            @media (max-width: 768px) {
                .question-detail-page {
                    padding: 20px 0;
                }
                
                .question-card {
                    padding: 20px;
                }
                
                .answers-section {
                    padding: 20px;
                }
                
                .answer-card {
                    flex-direction: column;
                    gap: 12px;
                }
                
                .answer-voting {
                    flex-direction: row;
                    gap: 12px;
                }
                
                .accepted-badge {
                    margin-top: 0;
                }
                
                .answer-footer {
                    flex-direction: column;
                    align-items: flex-start;
                }
            }
        </style>
    `
})
export class QuestionDetailComponent implements OnInit {
    question: Question | null = null;
    answers: Answer[] = [];
    newAnswer = '';
    isAuthenticated = false;
    isAuthor = false;
    currentUserId: string | null = null;
    sortByVotes = true;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private questionService: QuestionService,
        private answerService: AnswerService,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        this.authService.user$.subscribe(user => {
            this.isAuthenticated = !!user;
            this.currentUserId = user?.id || null;
            this.checkIfAuthor();
        });
        
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loadQuestion(id);
        }
    }

    checkIfAuthor(): void {
        if (this.question && this.currentUserId) {
            this.isAuthor = this.question.authorId?._id === this.currentUserId;
        }
    }

    get sortedAnswers(): Answer[] {
        if (this.sortByVotes) {
            return [...this.answers].sort((a, b) => b.votes - a.votes);
        } else {
            return [...this.answers].sort((a, b) => 
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
        }
    }

    toggleSort(): void {
        this.sortByVotes = !this.sortByVotes;
    }

    loadQuestion(id: string): void {
        this.questionService.getQuestionById(id).subscribe({
            next: (res) => {
                this.question = res.question;
                this.answers = res.answers;
                this.checkIfAuthor();
            },
            error: (err) => console.error(err)
        });
    }

    postAnswer(): void {
        if (this.question && this.newAnswer.trim()) {
            this.answerService.createAnswer(this.question._id, this.newAnswer).subscribe({
                next: () => {
                    this.newAnswer = '';
                    this.loadQuestion(this.question!._id);
                }
            });
        }
    }

    vote(answerId: string, type: 'up' | 'down'): void {
        this.answerService.voteAnswer(answerId, type).subscribe({
            next: () => this.loadQuestion(this.question!._id)
        });
    }

    acceptAnswer(answerId: string): void {
        this.answerService.acceptAnswer(answerId).subscribe({
            next: () => this.loadQuestion(this.question!._id)
        });
    }
}