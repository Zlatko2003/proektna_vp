import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../../services/question.service';
import { TagService } from '../../services/tag.service';
import { Question } from '../../models/question.model';
import { Tag } from '../../models/tag.model';

@Component({
    selector: 'app-questions',
    template: `
        <div class="container">
            <div class="search-hero">
                <div class="search-content">
                    <div class="hero-badge">
                        💡 Community Knowledge Base
                    </div>

                    <h1>
                        What can we help you
                        <span>discover today?</span>
                    </h1>

                    <p class="hero-description">
                        Search through thousands of questions, answers and discussions from the community.
                    </p>

                    <div class="ask-section">
                        <div class="ask-container">
                            <div class="ask-content">
                                <a routerLink="/ask" class="btn ask-btn">
                                    <span class="btn-content">
                                        <span class="btn-icon">🚀</span>
                                        <span class="btn-text">Ask the Community</span>
                                        <span class="btn-plus">+</span>
                                    </span>
                                    <span class="btn-particle"></span>
                                    <span class="btn-particle"></span>
                                    <span class="btn-particle"></span>
                                    <span class="btn-particle"></span>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div class="divider-section">
                        <div class="divider-line"></div>
                        <span class="divider-text">OR</span>
                        <div class="divider-line"></div>
                    </div>

                    <div class="search-section">
                        <div class="search-bar">
                            <div class="search-input-wrapper">
                                <span class="search-icon">🔍</span>

                                <input
                                    type="text"
                                    [(ngModel)]="searchTerm"
                                    (keyup.enter)="search()"
                                    placeholder="Search questions, topics, tags..."
                                    class="search-input"
                                    #searchInput
                                    (focus)="onSearchFocus()"
                                    (blur)="onSearchBlur()">

                                <button
                                    class="search-btn"
                                    (click)="search()"
                                    [class.searching]="isSearching">
                                    <span class="search-btn-text">
                                        <span class="search-icon-btn">🔍</span>
                                        Search
                                    </span>
                                    <span class="search-loader" *ngIf="isSearching"></span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="quick-actions" *ngIf="popularTags.length">
                        <span class="quick-label">⚡ Quick filters:</span>
                        <button 
                            class="quick-action" 
                            *ngFor="let tag of popularTags.slice(0, 6)"
                            [class.active]="selectedQuickTag === tag.name"
                            (click)="filterByQuickTag(tag.name)">
                            <span class="qa-icon">#</span>
                            {{ tag.name }}
                            <span class="qa-count">{{ tag.questionCount }}</span>
                        </button>
                        <button 
                            class="quick-action clear-filter"
                            *ngIf="selectedQuickTag"
                            (click)="clearQuickFilter()">
                            ✕ Clear
                        </button>
                    </div>

                    <div class="filters" *ngIf="popularTags.length > 6">
                        <div class="popular-tags-header">
                            🔥 All Trending Topics
                        </div>

                        <div class="tag-list">
                            <span
                                class="tag"
                                *ngFor="let tag of popularTags"
                                [class.active]="selectedTag === tag.name"
                                (click)="filterByTag(tag.name)">
                                #{{ tag.name }}
                                <small>{{ tag.questionCount }}</small>
                            </span>

                            <span
                                class="tag clear-tag"
                                *ngIf="selectedTag"
                                (click)="clearFilter()">
                                ✕ Clear
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="active-filters" *ngIf="selectedQuickTag || selectedTag || searchTerm">
                <span class="filter-label">🔍 Active filters:</span>
                <span class="filter-badge" *ngIf="selectedQuickTag">
                    #{{ selectedQuickTag }}
                    <span class="filter-remove" (click)="clearQuickFilter()">✕</span>
                </span>
                <span class="filter-badge" *ngIf="selectedTag">
                    #{{ selectedTag }}
                    <span class="filter-remove" (click)="clearFilter()">✕</span>
                </span>
                <span class="filter-badge" *ngIf="searchTerm && !selectedQuickTag && !selectedTag">
                    "{{ searchTerm }}"
                    <span class="filter-remove" (click)="clearSearch()">✕</span>
                </span>
                <button class="clear-all-btn" (click)="clearAllFilters()">Clear all</button>
            </div>
            
            <div *ngIf="loading" class="loading">
                <div class="spinner"></div>
                <p>Loading questions...</p>
            </div>
            
            <div *ngIf="!loading && questions.length === 0" class="empty-state card">
                <p>No questions found for 
                    <strong *ngIf="selectedQuickTag">#{{ selectedQuickTag }}</strong>
                    <strong *ngIf="selectedTag">#{{ selectedTag }}</strong>
                    <strong *ngIf="searchTerm && !selectedQuickTag && !selectedTag">"{{ searchTerm }}"</strong>
                </p>
                <a routerLink="/ask" class="btn btn-primary">Be the first to ask!</a>
            </div>
            
            <div class="row">
                <div
                    class="col-12 col-md-6"
                    *ngFor="let question of questions"
                >
                    <app-question-card [question]="question"></app-question-card>
                </div>
            </div>
            
            <div class="pagination" *ngIf="totalPages > 1">
                <button class="btn" (click)="prevPage()" [disabled]="currentPage === 1">← Previous</button>
                <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
                <button class="btn" (click)="nextPage()" [disabled]="currentPage === totalPages">Next →</button>
            </div>
        </div>
        <style>
            .search-hero {
                position: relative;
                overflow: hidden;
                margin-bottom: 35px;
                border-radius: 24px;
                padding: 20px 0;
            }

            .search-content {
                position: relative;
                z-index: 2;
                max-width: 900px;
                margin: 0 auto;
                text-align: center;
            }

            .hero-badge {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                padding: 8px 16px;
                margin-bottom: 20px;
                border-radius: 999px;
                background: rgba(99,102,241,.08);
                color: #6366f1;
                font-size: 13px;
                font-weight: 600;
            }

            .search-hero h1 {
                font-size: clamp(2rem, 5vw, 3.5rem);
                line-height: 1.1;
                font-weight: 800;
                margin-bottom: 16px;
                color: #1e293b;
            }

            .search-hero h1 span {
                display: block;
            }

            .hero-description {
                font-size: 1.05rem;
                color: #64748b;
                max-width: 700px;
                margin: 0 auto 30px;
            }

            .ask-section {
                width: 100%;
                padding: 10px 0 15px 0;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 24px;
                position: relative;
            }

            .ask-container {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
            }

            .ask-content {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 10px;
                position: relative;
            }

            .ask-btn {
                position: relative;
                display: inline-block;
                padding: 0;
                background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%);
                background-size: 200% 200%;
                border: none;
                border-radius: 20px;
                cursor: pointer;
                text-decoration: none;
                overflow: hidden;
                box-shadow: 0 8px 30px rgba(99, 102, 241, 0.35);
                transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                animation: gradientShift 4s ease-in-out infinite, pulseGlow 3s ease-in-out infinite;
            }

            @keyframes gradientShift {
                0%, 100% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
            }

            @keyframes pulseGlow {
                0%, 100% { box-shadow: 0 8px 30px rgba(99, 102, 241, 0.35); }
                50% { box-shadow: 0 8px 50px rgba(99, 102, 241, 0.6), 0 0 80px rgba(99, 102, 241, 0.15); }
            }

            .ask-btn:hover {
                transform: translateY(-5px) scale(1.04);
                box-shadow: 0 18px 55px rgba(99, 102, 241, 0.55);
                animation: none;
            }

            .ask-btn:active {
                transform: scale(0.95);
                box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
            }

            .btn-content {
                display: flex;
                align-items: center;
                gap: 14px;
                padding: 18px 44px;
                position: relative;
                z-index: 2;
                color: white;
                font-size: 19px;
                font-weight: 700;
                letter-spacing: 0.5px;
            }

            .btn-icon {
                font-size: 26px;
                animation: rocketFloat 2.5s ease-in-out infinite;
                filter: drop-shadow(0 2px 8px rgba(255,255,255,0.2));
            }

            @keyframes rocketFloat {
                0%, 100% { transform: translateY(0) rotate(-3deg) scale(1); }
                50% { transform: translateY(-10px) rotate(3deg) scale(1.1); }
            }

            .btn-text {
                position: relative;
            }

            .btn-text::after {
                content: '';
                position: absolute;
                bottom: -2px;
                left: 0;
                width: 0;
                height: 2px;
                background: rgba(255,255,255,0.5);
                transition: width 0.4s ease;
            }

            .ask-btn:hover .btn-text::after {
                width: 100%;
            }

            .btn-plus {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 34px;
                height: 34px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 50%;
                font-size: 26px;
                font-weight: 300;
                transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
                backdrop-filter: blur(4px);
            }

            .ask-btn:hover .btn-plus {
                transform: rotate(180deg) scale(1.2);
                background: rgba(255, 255, 255, 0.3);
                box-shadow: 0 0 20px rgba(255,255,255,0.1);
            }

            .btn-particle {
                position: absolute;
                border-radius: 50%;
                pointer-events: none;
                opacity: 0;
                transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
            }

            .btn-particle:nth-child(2) {
                top: 10%;
                left: 5%;
                width: 8px;
                height: 8px;
                background: rgba(255, 255, 255, 0.6);
            }

            .btn-particle:nth-child(3) {
                bottom: 10%;
                right: 5%;
                width: 12px;
                height: 12px;
                background: rgba(255, 255, 255, 0.4);
            }

            .btn-particle:nth-child(4) {
                top: 35%;
                left: 88%;
                width: 6px;
                height: 6px;
                background: rgba(255, 255, 255, 0.7);
            }

            .btn-particle:nth-child(5) {
                top: 65%;
                left: 8%;
                width: 10px;
                height: 10px;
                background: rgba(255, 255, 255, 0.3);
            }

            .ask-btn:hover .btn-particle {
                opacity: 1;
            }

            .ask-btn:hover .btn-particle:nth-child(2) {
                transform: translate(45px, -55px) scale(0);
            }

            .ask-btn:hover .btn-particle:nth-child(3) {
                transform: translate(-50px, -60px) scale(0);
            }

            .ask-btn:hover .btn-particle:nth-child(4) {
                transform: translate(-35px, -65px) scale(0);
            }

            .ask-btn:hover .btn-particle:nth-child(5) {
                transform: translate(35px, -50px) scale(0);
            }

            .divider-section {
                display: flex;
                align-items: center;
                gap: 20px;
                padding: 15px 0;
                max-width: 400px;
                margin: 0 auto;
            }

            .divider-line {
                flex: 1;
                height: 2px;
                background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
                position: relative;
            }

            .divider-text {
                font-size: 14px;
                font-weight: 700;
                color: #94a3b8;
                text-transform: uppercase;
                letter-spacing: 2px;
                padding: 0 10px;
                border-radius: 50%;
                min-width: 40px;
                text-align: center;
                position: relative;
            }

            .divider-text::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 40px;
                height: 40px;
                background: rgba(99,102,241,0.05);
                border-radius: 50%;
                z-index: -1;
            }

            .search-section {
                padding: 5px 0 10px 0;
            }

            .search-bar {
                width: 100%;
            }

            .search-input-wrapper {
                display: flex;
                align-items: center;
                background: white;
                border: 2px solid #eef2ff;
                border-radius: 18px;
                padding: 8px;
                box-shadow: 0 10px 25px rgba(99,102,241,.08);
                transition: all 0.3s ease;
            }

            .search-input-wrapper:focus-within {
                border-color: #6366f1;
                box-shadow: 0 15px 40px rgba(99,102,241,.15);
                transform: scale(1.01);
            }

            .search-input {
                flex: 1;
                border: none;
                outline: none;
                background: transparent;
                padding: 14px 0;
                font-size: 16px;
                transition: all 0.3s ease;
            }

            .search-input:focus {
                padding-left: 5px;
            }

            .search-icon {
                font-size: 20px;
                margin: 0 12px;
                opacity: 0.7;
                transition: all 0.3s ease;
            }

            .search-input-wrapper:focus-within .search-icon {
                opacity: 1;
                transform: scale(1.1);
            }

            .search-btn {
                position: relative;
                border: none;
                padding: 14px 28px;
                border-radius: 14px;
                font-weight: 600;
                cursor: pointer;
                background: linear-gradient(135deg, #6366f1, #8b5cf6);
                color: white;
                transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                overflow: hidden;
                min-width: 120px;
            }

            .search-btn:hover {
                transform: translateY(-2px) scale(1.03);
                box-shadow: 0 10px 35px rgba(99, 102, 241, 0.4);
            }

            .search-btn:active {
                transform: scale(0.95);
            }

            .search-btn.searching {
                pointer-events: none;
                opacity: 0.85;
            }

            .search-btn-text {
                display: flex;
                align-items: center;
                gap: 10px;
                position: relative;
                z-index: 2;
            }

            .search-icon-btn {
                font-size: 18px;
                transition: transform 0.5s ease;
            }

            .search-btn:hover .search-icon-btn {
                transform: rotate(-15deg) scale(1.2);
            }

            .search-loader {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 24px;
                height: 24px;
                border: 3px solid rgba(255, 255, 255, 0.3);
                border-top-color: white;
                border-radius: 50%;
                animation: spin 0.8s linear infinite;
            }

            @keyframes spin {
                to { transform: translate(-50%, -50%) rotate(360deg); }
            }

            .search-btn::after {
                content: '';
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.12) 50%, transparent 70%);
                transform: translateX(-100%);
                transition: transform 0.8s ease;
            }

            .search-btn:hover::after {
                transform: translateX(100%);
            }

            .quick-actions {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                margin-top: 20px;
                justify-content: center;
                align-items: center;
            }

            .quick-label {
                font-size: 13px;
                font-weight: 600;
                color: #94a3b8;
                margin-right: 4px;
            }

            .quick-action {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                padding: 8px 16px;
                background: white;
                border: 2px solid #eef2ff;
                border-radius: 999px;
                font-size: 13px;
                font-weight: 600;
                color: #4b5563;
                cursor: pointer;
                transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                box-shadow: 0 2px 10px rgba(0,0,0,0.04);
            }

            .quick-action:hover {
                transform: translateY(-3px) scale(1.05);
                border-color: #6366f1;
                box-shadow: 0 8px 30px rgba(99, 102, 241, 0.2);
                color: #6366f1;
                background: #f8faff;
            }

            .quick-action:active {
                transform: scale(0.95);
            }

            .quick-action.active {
                background: linear-gradient(135deg, #6366f1, #8b5cf6);
                color: white;
                border-color: #6366f1;
                box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3);
            }

            .quick-action.active:hover {
                transform: translateY(-3px) scale(1.05);
                box-shadow: 0 12px 35px rgba(99, 102, 241, 0.4);
            }

            .qa-icon {
                font-size: 14px;
                font-weight: 700;
            }

            .qa-count {
                font-size: 11px;
                opacity: 0.7;
                background: rgba(0,0,0,0.06);
                padding: 1px 8px;
                border-radius: 999px;
            }

            .quick-action.active .qa-count {
                background: rgba(255,255,255,0.2);
            }

            .quick-action.clear-filter {
                background: #fee2e2;
                border-color: #fca5a5;
                color: #dc2626;
            }

            .quick-action.clear-filter:hover {
                background: #fecaca;
                transform: translateY(-2px);
            }

            .active-filters {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                gap: 10px;
                padding: 12px 20px;
                background: #f8fafc;
                border-radius: 12px;
                margin: 20px 0 10px 0;
                border: 1px solid #eef2ff;
            }

            .filter-label {
                font-size: 14px;
                font-weight: 600;
                color: #64748b;
            }

            .filter-badge {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                padding: 6px 12px 6px 16px;
                background: linear-gradient(135deg, #6366f1, #8b5cf6);
                color: white;
                border-radius: 999px;
                font-size: 13px;
                font-weight: 600;
                animation: fadeInUp 0.3s ease;
            }

            .filter-remove {
                cursor: pointer;
                opacity: 0.7;
                transition: all 0.2s ease;
                font-size: 14px;
                display: inline-flex;
                align-items: center;
            }

            .filter-remove:hover {
                opacity: 1;
                transform: scale(1.2);
            }

            .clear-all-btn {
                padding: 6px 16px;
                background: transparent;
                border: 1px solid #e2e8f0;
                border-radius: 999px;
                font-size: 13px;
                font-weight: 600;
                color: #64748b;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .clear-all-btn:hover {
                background: #ef4444;
                color: white;
                border-color: #ef4444;
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(239, 68, 68, 0.2);
            }

            .tag-list {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                justify-content: center;
            }
            
            .tag {
                cursor: pointer;
                transition: var(--transition);
            }
            
            .tag.active {
                background: var(--primary-color);
                color: white;
            }
            
            .clear-tag {
                background: var(--danger-color);
                color: white;
            }
            
            .clear-tag:hover {
                background: #c0392b;
            }
            
            .loading {
                text-align: center;
                padding: 50px;
            }

            .loading .spinner {
                width: 40px;
                height: 40px;
                margin: 0 auto 20px;
                border: 4px solid #eef2ff;
                border-top-color: #6366f1;
                border-radius: 50%;
                animation: spin 0.8s linear infinite;
            }
            
            .empty-state {
                text-align: center;
                padding: 50px;
            }
            
            .empty-state p {
                margin-bottom: 20px;
                font-size: 18px;
                color: var(--gray-color);
            }
            
            .pagination {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 15px;
                margin-top: 30px;
            }
            
            .page-info {
                padding: 8px 16px;
                background: var(--white);
                border-radius: 5px;
                box-shadow: var(--shadow);
            }

            .filters {
                margin-top: 28px;
            }

            .popular-tags-header {
                margin-bottom: 12px;
                font-size: 14px;
                font-weight: 700;
                color: var(--gray-color);
                text-align: center;
            }

            .tag {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                padding: 10px 14px;
                border-radius: 999px;
                background: #f8fafc;
                cursor: pointer;
                transition: .25s;
            }

            .tag:hover {
                transform: translateY(-2px);
                background: #eef2ff;
            }

            .tag.active {
                background: var(--primary-color);
                color: white;
            }

            .tag small {
                opacity: .7;
            }

            .clear-tag {
                background: #ef4444;
                color: white;
            }

            @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(12px); }
                to { opacity: 1; transform: translateY(0); }
            }

            @media (max-width: 768px) {
                .search-hero {
                    padding: 20px 16px;
                }

                .ask-btn {
                    width: 100%;
                    max-width: 340px;
                }

                .btn-content {
                    padding: 16px 28px;
                    font-size: 17px;
                    justify-content: center;
                }

                .btn-icon {
                    font-size: 22px;
                }

                .btn-plus {
                    width: 30px;
                    height: 30px;
                    font-size: 22px;
                }

                .search-input-wrapper {
                    flex-direction: column;
                    gap: 10px;
                    align-items: stretch;
                }

                .search-btn {
                    width: 100%;
                }

                .search-icon {
                    display: none;
                }

                .quick-actions {
                    gap: 8px;
                }

                .quick-action {
                    padding: 6px 12px;
                    font-size: 12px;
                }

                .active-filters {
                    padding: 10px 16px;
                    gap: 8px;
                }

                .filter-badge {
                    font-size: 12px;
                    padding: 4px 10px 4px 12px;
                }

                .divider-section {
                    max-width: 280px;
                    gap: 12px;
                }

                .divider-text {
                    font-size: 12px;
                    min-width: 32px;
                }

                .divider-text::before {
                    width: 32px;
                    height: 32px;
                }
            }
        </style>
    `
})
export class QuestionsComponent implements OnInit {
    questions: Question[] = [];
    popularTags: Tag[] = [];
    loading = false;
    isSearching = false;
    currentPage = 1;
    totalPages = 1;
    searchTerm = '';
    selectedTag = '';
    selectedQuickTag = '';

    constructor(
        private questionService: QuestionService,
        private tagService: TagService
    ) { }

    ngOnInit(): void {
        this.loadQuestions();
        this.loadPopularTags();
    }

    loadQuestions(): void {
        this.loading = true;
        this.questionService.getAllQuestions(this.currentPage, this.searchTerm, this.selectedTag || this.selectedQuickTag)
            .subscribe({
                next: (res) => {
                    this.questions = res.questions;
                    this.totalPages = res.totalPages;
                    this.loading = false;
                },
                error: (err) => {
                    console.error(err);
                    this.loading = false;
                }
            });
    }

    loadPopularTags(): void {
        this.tagService.getPopularTags().subscribe({
            next: (tags) => this.popularTags = tags,
            error: (err) => console.error(err)
        });
    }

    search(): void {
        if (this.searchTerm.trim()) {
            this.isSearching = true;
            this.currentPage = 1;
            this.selectedQuickTag = '';
            this.selectedTag = '';
            this.loadQuestions();
            setTimeout(() => this.isSearching = false, 800);
        }
    }

    filterByQuickTag(tag: string): void {
        if (this.selectedQuickTag === tag) {
            this.selectedQuickTag = '';
        } else {
            this.selectedQuickTag = tag;
            this.selectedTag = '';
            this.searchTerm = '';
        }
        this.currentPage = 1;
        this.loadQuestions();
    }

    clearQuickFilter(): void {
        this.selectedQuickTag = '';
        this.currentPage = 1;
        this.loadQuestions();
    }

    filterByTag(tag: string): void {
        if (this.selectedTag === tag) {
            this.selectedTag = '';
        } else {
            this.selectedTag = tag;
            this.selectedQuickTag = '';
            this.searchTerm = '';
        }
        this.currentPage = 1;
        this.loadQuestions();
    }

    clearFilter(): void {
        this.selectedTag = '';
        this.currentPage = 1;
        this.loadQuestions();
    }

    clearSearch(): void {
        this.searchTerm = '';
        this.currentPage = 1;
        this.loadQuestions();
    }

    clearAllFilters(): void {
        this.selectedQuickTag = '';
        this.selectedTag = '';
        this.searchTerm = '';
        this.currentPage = 1;
        this.loadQuestions();
    }

    onSearchFocus(): void {
    }

    onSearchBlur(): void {
    }

    prevPage(): void {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.loadQuestions();
        }
    }

    nextPage(): void {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.loadQuestions();
        }
    }
}