import { Component, Input, OnInit } from '@angular/core';
import { GithubService } from '../../services/github.service';

@Component({
    selector: 'app-github-repos',
    template: `
        <div class="github-section" *ngIf="repos.length > 0">
            <div class="github-header">
                <span>📦</span>
                <h3>Related GitHub Repositories</h3>
            </div>
            <div class="repo-list">
                <div class="repo-card" *ngFor="let repo of repos">
                    <a [href]="repo.url" target="_blank" class="repo-name">
                        {{ repo.name }}
                    </a>
                    <p class="repo-description">{{ repo.description | truncate:100 }}</p>
                    <div class="repo-stats">
                        <span>⭐ {{ repo.stars }}</span>
                        <span>🍴 {{ repo.forks }}</span>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [`
        .github-section {
            background: linear-gradient(135deg, #0d1117 0%, #161b22 100%);
            border-radius: 24px;
            padding: 20px;
            margin: 0 0 20px 0;
            border: 1px solid #30363d;
        }
        
        .github-header {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 16px;
        }
        
        .github-header span {
            font-size: 24px;
        }
        
        .github-header h3 {
            color: white;
            font-size: 16px;
            margin: 0;
        }
        
        .repo-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        
        .repo-card {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 14px;
            padding: 12px;
            transition: all 0.2s;
        }
        
        .repo-card:hover {
            background: rgba(255, 255, 255, 0.1);
            transform: translateX(4px);
        }
        
        .repo-name {
            color: #58a6ff;
            text-decoration: none;
            font-weight: 600;
            font-size: 14px;
        }
        
        .repo-name:hover {
            text-decoration: underline;
        }
        
        .repo-description {
            color: #8b949e;
            font-size: 12px;
            margin: 6px 0;
        }
        
        .repo-stats {
            display: flex;
            gap: 12px;
            font-size: 11px;
            color: #8b949e;
        }
        
        .repo-stats span {
            display: flex;
            align-items: center;
            gap: 4px;
        }
    `]
})
export class GithubReposComponent implements OnInit {
    @Input() tag: string = '';
    repos: any[] = [];

    constructor(private githubService: GithubService) { }

    ngOnInit(): void {
        if (this.tag) {
            this.githubService.searchRepos(this.tag).subscribe({
                next: (repos) => this.repos = repos,
                error: (err) => console.error(err)
            });
        }
    }
}