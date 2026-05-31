import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../../services/question.service';
import { TagService } from '../../services/tag.service';
import { Question } from '../../models/question.model';
import { Tag } from '../../models/tag.model';

@Component({
    selector: 'app-questions',
    template: `
        <div class="container">
            <div class="page-header">
                <a routerLink="/ask" class="btn btn-primary ask_question_plus">+ Ask Question</a>
            </div>
            
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

                    <div class="search-bar">
                        <div class="search-input-wrapper">
                            <span class="search-icon">🔍</span>

                            <input
                                type="text"
                                [(ngModel)]="searchTerm"
                                (keyup.enter)="search()"
                                placeholder="Search questions, topics, tags..."
                                class="search-input">

                            <button
                                class="search-btn"
                                (click)="search()">
                                Search
                            </button>
                        </div>
                    </div>

                    <div class="filters" *ngIf="popularTags.length">
                        <div class="popular-tags-header">
                            🔥 Trending Topics
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
            
            <div *ngIf="loading" class="loading">
                <div class="spinner"></div>
                <p>Loading questions...</p>
            </div>
            
            <div *ngIf="!loading && questions.length === 0" class="empty-state card">
                <p>No questions found.</p>
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
            .page-header {
                display: flex;
                justify-content: flex-end;
                align-items: center;
                margin-bottom: 10px;
                flex-wrap: wrap;
                gap: 15px;
            }
            
            .page-header h1 {
                font-size: 28px;
                background: linear-gradient(135deg, var(--dark-color) 0%, var(--primary-color) 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            
            .filters label {
                display: block;
                margin-bottom: 10px;
                font-weight: 600;
            }
            
            .tag-list {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
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

            .search-hero {
                position: relative;
                overflow: hidden;

                margin-bottom: 35px;

                border-radius: 24px;
            }

            .search-content {
                position: relative;
                z-index: 2;
                max-width: 900px;
            }

            .hero-badge {
                display: inline-flex;
                align-items: center;
                gap: 8px;

                padding: 8px 16px;
                margin-bottom: 20px;

                border-radius: 999px;

                background: rgba(99,102,241,.08);
                color: var(--primary-color);

                font-size: 13px;
                font-weight: 600;
            }

            .search-hero h1 {
                font-size: clamp(2rem, 5vw, 3.5rem);
                line-height: 1.1;
                font-weight: 800;

                margin-bottom: 16px;

                color: var(--dark-color);
            }

            .search-hero h1 span {
                display: block;
            }

            .hero-description {
                font-size: 1.05rem;
                color: var(--gray-color);

                max-width: 700px;
                margin-bottom: 30px;
            }

            .search-input-wrapper {
                display: flex;
                align-items: center;

                background: white;
                border: 2px solid #eef2ff;

                border-radius: 18px;

                padding: 8px;

                box-shadow:
                    0 10px 25px rgba(99,102,241,.08);

                transition: .25s;
            }

            .search-input-wrapper:focus-within {
                border-color: var(--primary-color);
                box-shadow:
                    0 15px 35px rgba(99,102,241,.15);
            }

            .search-icon {
                font-size: 20px;
                margin: 0 12px;
                opacity: .7;
            }

            .search-input {
                flex: 1;

                border: none;
                outline: none;

                background: transparent;

                padding: 14px 0;

                font-size: 16px;
            }

            .search-btn {
                border: none;

                padding: 14px 24px;

                border-radius: 14px;

                font-weight: 600;
                cursor: pointer;

                // background: linear-gradient(
                //     135deg,
                //     var(--primary-color),
                //     #6366f1
                // );

                // color: white;

                transition: .25s;
            }

            .search-btn:hover {
                transform: translateY(-2px);
            }

            .filters {
                margin-top: 28px;
            }

            .popular-tags-header {
                margin-bottom: 12px;

                font-size: 14px;
                font-weight: 700;

                color: var(--gray-color);
            }

            .tag-list {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
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

            .hero-glow {
                position: absolute;

                width: 350px;
                height: 350px;

                right: -100px;
                top: -100px;

                background: radial-gradient(
                    circle,
                    rgba(99,102,241,.15),
                    transparent 70%
                );

                pointer-events: none;
            }

            @media (max-width: 768px) {
                .search-hero {
                    padding: 35px 20px;
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
                
                .search-bar {
                    flex-direction: column;
                }
            }
        </style>
    `
})
export class QuestionsComponent implements OnInit {
    questions: Question[] = [];
    popularTags: Tag[] = [];
    loading = false;
    currentPage = 1;
    totalPages = 1;
    searchTerm = '';
    selectedTag = '';

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
        this.questionService.getAllQuestions(this.currentPage, this.searchTerm, this.selectedTag)
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
        this.currentPage = 1;
        this.loadQuestions();
    }

    filterByTag(tag: string): void {
        this.selectedTag = this.selectedTag === tag ? '' : tag;
        this.currentPage = 1;
        this.loadQuestions();
    }

    clearFilter(): void {
        this.selectedTag = '';
        this.currentPage = 1;
        this.loadQuestions();
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