import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { QuestionService } from '../../services/question.service';

@Component({
    selector: 'app-ask-question',
    template: `
        <div class="ask-page">
            <div class="container">
                <div class="ask-hero">
                    <div class="ask-badge">
                        ✍️ Share Knowledge
                    </div>
                    <h1>
                        Ask a
                        <span>Question</span>
                    </h1>
                    <p class="hero-description">
                        Get answers from experienced developers. Be specific and provide details.
                    </p>
                </div>

                <div class="ask-card">
                    <div class="alert alert-error" *ngIf="errorMessage">
                        <span>⚠️ {{ errorMessage }}</span>
                        <button class="close-btn" (click)="errorMessage = null">×</button>
                    </div>
                    
                    <form #questionForm="ngForm" (ngSubmit)="onSubmit()">
                        <div class="form-group" [class.has-error]="titleInvalid && titleTouched">
                            <label>Title</label>
                            <div class="hint">Be specific and imagine you're asking a question to another person</div>
                            <div class="input-wrapper">
                                <span class="input-icon">📌</span>
                                <input type="text" 
                                       [(ngModel)]="title" 
                                       name="title" 
                                       #titleInput="ngModel"
                                       required 
                                       minlength="10"
                                       maxlength="200"
                                       (blur)="titleTouched = true"
                                       (input)="titleTouched = true"
                                       placeholder="e.g., How do I use useState in React?">
                            </div>
                            <div class="error-message" *ngIf="titleInvalid && titleTouched">
                                <span *ngIf="titleInput.errors?.['required']">Title is required</span>
                                <span *ngIf="titleInput.errors?.['minlength']">Title must be at least 10 characters (current: {{ title.length }})</span>
                                <span *ngIf="titleInput.errors?.['maxlength']">Title cannot exceed 200 characters</span>
                            </div>
                            <div class="char-counter" *ngIf="title.length > 0">
                                {{ title.length }} / 200 characters
                            </div>
                        </div>
                        
                        <div class="form-group" [class.has-error]="contentInvalid && contentTouched">
                            <label>Content</label>
                            <div class="hint">Provide details about your question. Include what you've tried and what you expect</div>
                            <div class="textarea-wrapper">
                                <textarea [(ngModel)]="content" 
                                          name="content" 
                                          #contentInput="ngModel"
                                          required 
                                          rows="10" 
                                          minlength="20"
                                          maxlength="5000"
                                          (blur)="contentTouched = true"
                                          (input)="contentTouched = true"
                                          placeholder="Write your question in detail..."></textarea>
                            </div>
                            <div class="error-message" *ngIf="contentInvalid && contentTouched">
                                <span *ngIf="contentInput.errors?.['required']">Content is required</span>
                                <span *ngIf="contentInput.errors?.['minlength']">Content must be at least 20 characters (current: {{ content.length }})</span>
                                <span *ngIf="contentInput.errors?.['maxlength']">Content cannot exceed 5000 characters</span>
                            </div>
                            <div class="char-counter" *ngIf="content.length > 0">
                                {{ content.length }} / 5000 characters
                            </div>
                        </div>
                        
                        <div class="form-group" [class.has-error]="tagsInvalid && tagsTouched">
                            <label>Tags</label>
                            <div class="hint">Add up to 5 tags to help others find your question</div>
                            <div class="input-wrapper">
                                <span class="input-icon">🏷️</span>
                                <input type="text" 
                                       [(ngModel)]="tags" 
                                       name="tags" 
                                       #tagsInput="ngModel"
                                       (blur)="tagsTouched = true"
                                       (input)="tagsTouched = true"
                                       placeholder="e.g., react, javascript, nodejs (comma separated)">
                            </div>
                            <div class="error-message" *ngIf="tagsInvalid && tagsTouched">
                                <span *ngIf="tagCount === 0 && tags.length > 0">Invalid tag format. Use lowercase letters, numbers and commas</span>
                                <span *ngIf="tagCount > 5">Maximum 5 tags allowed (current: {{ tagCount }})</span>
                                <span *ngIf="tagLengthError">Each tag must be between 2-20 characters</span>
                            </div>
                            <div class="info-message" *ngIf="tagCount > 0 && !tagsInvalid">
                                <span>✓ {{ tagCount }} / 5 tags added</span>
                            </div>
                            <div class="tag-preview" *ngIf="tagCount > 0 && !tagsInvalid">
                                <span class="preview-tag" *ngFor="let tag of getTagArray()">
                                    #{{ tag }}
                                </span>
                            </div>
                        </div>
                        
                        <div class="form-actions">
                            <button type="button" class="cancel-btn" (click)="cancel()">Cancel</button>
                            <button type="submit" 
                                    class="submit-btn" 
                                    [disabled]="questionForm.invalid || isSubmitting || tagCount > 5 || tagLengthError">
                                {{ isSubmitting ? 'Posting...' : 'Post Question' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <style>
            .ask-page {
                background: var(--bg-light);
                min-height: 100vh;
                padding: 60px 0;
            }
            
            .ask-hero {
                text-align: center;
                max-width: 700px;
                margin: 0 auto 48px;
            }
            
            .ask-badge {
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
            
            .ask-hero h1 {
                font-size: clamp(2rem, 5vw, 3rem);
                font-weight: 800;
                margin-bottom: 16px;
                color: var(--dark);
            }
            
            .ask-hero h1 span {
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
            
            .ask-card {
                max-width: 800px;
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
                margin-bottom: 28px;
            }
            
            .form-group label {
                display: block;
                margin-bottom: 8px;
                font-weight: 600;
                font-size: 15px;
                color: var(--dark);
            }
            
            .hint {
                font-size: 13px;
                color: var(--gray);
                margin-bottom: 10px;
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
            
            .textarea-wrapper textarea {
                width: 100%;
                padding: 14px;
                border: 2px solid var(--gray-lighter);
                border-radius: 14px;
                font-size: 15px;
                font-family: inherit;
                resize: vertical;
                transition: all 0.2s;
                background: white;
            }
            
            .textarea-wrapper textarea:focus {
                outline: none;
                border-color: var(--primary);
                box-shadow: 0 0 0 3px rgba(99,102,241,.1);
            }
            
            .form-group.has-error input,
            .form-group.has-error textarea {
                border-color: var(--danger);
                background: #fef2f2;
            }
            
            .error-message {
                color: var(--danger);
                font-size: 12px;
                margin-top: 6px;
            }
            
            .error-message span {
                display: block;
            }
            
            .char-counter {
                font-size: 12px;
                color: var(--gray-light);
                margin-top: 6px;
                text-align: right;
            }
            
            .info-message {
                color: var(--primary);
                font-size: 12px;
                margin-top: 6px;
            }
            
            .tag-preview {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin-top: 10px;
            }
            
            .preview-tag {
                background: rgba(99,102,241,.1);
                color: var(--primary);
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 500;
            }
            
            .form-actions {
                display: flex;
                justify-content: flex-end;
                gap: 16px;
                margin-top: 32px;
                padding-top: 24px;
                border-top: 1px solid var(--gray-lighter);
            }
            
            .cancel-btn {
                padding: 12px 28px;
                background: transparent;
                color: var(--gray);
                border: 1px solid var(--gray-lighter);
                border-radius: 40px;
                font-size: 15px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .cancel-btn:hover {
                border-color: var(--danger);
                color: var(--danger);
            }
            
            .submit-btn {
                padding: 12px 32px;
                background: var(--primary);
                color: white;
                border: none;
                border-radius: 40px;
                font-size: 15px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .submit-btn:hover:not(:disabled) {
                background: var(--primary-dark);
                transform: translateY(-2px);
            }
            
            .submit-btn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }
            
            @media (max-width: 768px) {
                .ask-page {
                    padding: 40px 0;
                }
                
                .ask-card {
                    padding: 24px;
                }
                
                .form-actions {
                    flex-direction: column;
                }
                
                .form-actions button {
                    width: 100%;
                }
                
                .tag-preview {
                    justify-content: center;
                }
            }
        </style>
    `
})
export class AskQuestionComponent {
    title = '';
    content = '';
    tags = '';
    titleTouched = false;
    contentTouched = false;
    tagsTouched = false;
    isSubmitting = false;
    errorMessage: string | null = null;

    constructor(
        private questionService: QuestionService,
        private router: Router
    ) { }

    get titleInvalid(): boolean {
        const errors = this.getTitleErrors();
        return errors.length > 0;
    }

    get contentInvalid(): boolean {
        const errors = this.getContentErrors();
        return errors.length > 0;
    }

    get tagsInvalid(): boolean {
        const errors = this.getTagErrors();
        return errors.length > 0;
    }

    getTitleErrors(): string[] {
        const errors: string[] = [];
        if (!this.title && this.titleTouched) errors.push('Title is required');
        if (this.title.length > 0 && this.title.length < 10) errors.push('Title must be at least 10 characters');
        if (this.title.length > 200) errors.push('Title cannot exceed 200 characters');
        return errors;
    }

    getContentErrors(): string[] {
        const errors: string[] = [];
        if (!this.content && this.contentTouched) errors.push('Content is required');
        if (this.content.length > 0 && this.content.length < 20) errors.push('Content must be at least 20 characters');
        if (this.content.length > 5000) errors.push('Content cannot exceed 5000 characters');
        return errors;
    }

    getTagErrors(): string[] {
        const errors: string[] = [];
        if (!this.tagsTouched) return errors;
        
        const tagArray = this.getTagArray();
        
        if (tagArray.length === 0 && this.tags.length > 0) {
            errors.push('Invalid tag format. Use lowercase letters, numbers and commas');
        }
        
        if (tagArray.length > 5) {
            errors.push(`Maximum 5 tags allowed (current: ${tagArray.length})`);
        }
        
        for (const tag of tagArray) {
            if (tag.length < 2 || tag.length > 20) {
                errors.push(`Tag "${tag}" must be between 2-20 characters`);
                break;
            }
        }
        
        return errors;
    }

    get tagCount(): number {
        return this.getTagArray().length;
    }

    get tagLengthError(): boolean {
        const tagArray = this.getTagArray();
        for (const tag of tagArray) {
            if (tag.length < 2 || tag.length > 20) {
                return true;
            }
        }
        return false;
    }

    getTagArray(): string[] {
        if (!this.tags.trim()) return [];
        return this.tags.split(',')
            .map(t => t.trim().toLowerCase())
            .filter(t => t.length > 0);
    }

    cancel(): void {
        this.router.navigate(['/questions']);
    }

    onSubmit(): void {
        this.titleTouched = true;
        this.contentTouched = true;
        this.tagsTouched = true;
        
        if (this.titleInvalid || this.contentInvalid || this.tagsInvalid) {
            this.errorMessage = 'Please fix the errors above before posting';
            return;
        }
        
        const tagArray = this.getTagArray();
        
        this.isSubmitting = true;
        this.errorMessage = null;
        
        this.questionService.createQuestion({
            title: this.title.trim(),
            content: this.content.trim(),
            tags: tagArray
        }).subscribe({
            next: (res) => {
                this.isSubmitting = false;
                this.router.navigate(['/questions', res._id]);
            },
            error: (err) => {
                this.isSubmitting = false;
                this.errorMessage = err.error?.error || 'Failed to post question. Please try again.';
                console.error(err);
            }
        });
    }
}