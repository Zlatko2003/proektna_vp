import { Component, Input } from '@angular/core';
import { Question } from '../../models/question.model';

@Component({
    selector: 'app-question-card',
    template: `
        <div class="question-card animate-fadeInUp">
            <div class="question-stats">
                <div class="stat">
                    <span class="stat-value">{{ question.views || 0 }}</span>
                    <span class="stat-label">views</span>
                </div>
                <div class="stat">
                    <span class="stat-value">{{ answerCount }}</span>
                    <span class="stat-label">answers</span>
                </div>
            </div>
            
            <div class="question-content" [routerLink]="['/questions', question._id]">
                <h3>
                    <a [routerLink]="['/questions', question._id]">{{ question.title }}</a>
                </h3>
                <p class="question-excerpt">{{ question.content | truncate:120 }}</p>
                <div class="question-meta">
                    <div class="tags">
                        <span class="tag" *ngFor="let tag of question.tags.slice(0, 3)">
                            #{{ tag }}
                        </span>
                    </div>
                    <div class="author-info">
                        <span class="author-avatar">{{ question.authorId.name.charAt(0) || '?' }}</span>
                        <span class="author-name">{{ question.authorId.name }}</span>
                        <span class="post-date">{{ question.createdAt | date:'MMM d, yyyy' }}</span>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [`
        .question-card {
            background: var(--white);
            border-radius: var(--radius);
            padding: 20px;
            margin-bottom: 16px;
            display: flex;
            gap: 20px;
            transition: all 0.2s ease;
            border: 1px solid transparent;
        }
        
        .question-card:hover {
            transform: translateX(4px);
            background: var(--gray-lighter);
            cursor: pointer;
        }
        
        .question-stats {
            display: flex;
            flex-direction: column;
            gap: 12px;
            min-width: 80px;
            text-align: center;
        }
        
        .stat {
            display: flex;
            flex-direction: column;
        }
        
        .stat-value {
            font-size: 18px;
            font-weight: 700;
            color: var(--dark);
        }
        
        .stat-label {
            font-size: 11px;
            color: var(--gray-light);
            text-transform: uppercase;
        }
        
        .question-content {
            flex: 1;
        }
        
        .question-content h3 {
            margin: 0 0 10px 0;
        }
        
        .question-content h3 a {
            color: var(--dark);
            text-decoration: none;
            font-size: 18px;
            font-weight: 600;
            transition: color 0.2s;
        }
        
        .question-content h3 a:hover {
            color: var(--primary);
        }
        
        .question-excerpt {
            color: var(--gray);
            font-size: 14px;
            line-height: 1.5;
            margin-bottom: 12px;
        }
        
        .question-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 12px;
        }
        
        .tags {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
        }
        
        .tag {
            background: var(--bg-light);
            padding: 3px 10px;
            font-size: 11px;
            font-weight: 500;
        }
        
        .author-info {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 12px;
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
            color: var(--gray-dark);
            font-weight: 500;
        }
        
        .post-date {
            color: var(--gray-light);
        }
        
        @media (max-width: 768px) {
            .question-card {
                flex-direction: column;
                gap: 12px;
            }
            
            .question-stats {
                flex-direction: row;
                gap: 20px;
                min-width: auto;
            }
            
            .question-meta {
                flex-direction: column;
                align-items: flex-start;
            }
        }
    `]
})
export class QuestionCardComponent {
    @Input() question!: Question;

    get answerCount(): number {
        return 0;
    }
}