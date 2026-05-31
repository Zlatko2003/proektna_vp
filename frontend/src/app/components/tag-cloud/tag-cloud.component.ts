import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TagService } from '../../services/tag.service';
import { Tag } from '../../models/tag.model';

@Component({
    selector: 'app-tag-cloud',
    template: `
        <div class="tag-cloud-card">
            <div class="card-header">
                <h3>🏷️ Popular Tags</h3>
            </div>
            <div class="tag-cloud">
                <span class="tag" 
                      *ngFor="let tag of tags" 
                      (click)="onTagClick(tag.name)"
                      [style.font-size.px]="getTagSize(tag)">
                    {{ tag.name }}
                    <span class="tag-count">{{ tag.questionCount }}</span>
                </span>
            </div>
            <div class="card-footer" *ngIf="tags.length === 0">
                <p>No tags yet</p>
            </div>
        </div>
    `,
    styles: [`
        .tag-cloud-card {
            background: var(--white);
            border-radius: var(--radius);
            padding: 20px;
            margin-bottom: 24px;
            box-shadow: var(--shadow-sm);
        }
        
        .card-header h3 {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 16px;
            color: var(--dark);
        }
        
        .tag-cloud {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
        }
        
        .tag {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: var(--bg-light);
            padding: 6px 14px;
            border-radius: 30px;
            cursor: pointer;
            transition: all 0.2s;
            font-weight: 500;
        }
        
        .tag:hover {
            background: var(--primary);
            color: white;
            transform: translateY(-2px);
        }
        
        .tag-count {
            background: rgba(0, 0, 0, 0.1);
            border-radius: 20px;
            padding: 2px 6px;
            font-size: 10px;
            font-weight: 600;
        }
        
        .tag:hover .tag-count {
            background: rgba(255, 255, 255, 0.2);
        }
        
        .card-footer {
            text-align: center;
            padding: 20px;
            color: var(--gray);
        }
    `]
})
export class TagCloudComponent implements OnInit {
    tags: Tag[] = [];
    @Output() tagClick = new EventEmitter<string>();

    constructor(private tagService: TagService) { }

    ngOnInit(): void {
        this.tagService.getPopularTags().subscribe({
            next: (tags) => this.tags = tags,
            error: (err) => console.error(err)
        });
    }

    getTagSize(tag: Tag): number {
        const minSize = 12;
        const maxSize = 24;
        const maxCount = Math.max(...this.tags.map(t => t.questionCount), 1);
        const size = minSize + (tag.questionCount / maxCount) * (maxSize - minSize);
        return Math.floor(size);
    }

    onTagClick(tag: string): void {
        this.tagClick.emit(tag);
    }
}