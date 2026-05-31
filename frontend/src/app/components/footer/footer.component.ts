import { Component } from '@angular/core';

@Component({
    selector: 'app-footer',
    template: `
        <footer class="footer">
            <div class="container">
                <div class="footer-content">
                    <div class="footer-brand">
                        <span class="logo-icon">⌨️</span>
                        <span>DevQ&A</span>
                        <p>Where developers find answers</p>
                    </div>
                    <div class="footer-links">
                        <a routerLink="/questions">Questions</a>
                        <a routerLink="/ask">Ask</a>
                    </div>
                    <div class="footer-copyright">
                        © 2026 DevQ&A. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    `,
    styles: [`
        .footer {
            background: var(--dark);
            color: rgba(255, 255, 255, 0.7);
            padding: 40px 0 24px;
            margin-top: auto;
        }
        
        .footer-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 20px;
        }
        
        .footer-brand span:first-child {
            font-size: 28px;
        }
        
        .footer-brand span:last-child {
            font-size: 20px;
            font-weight: 700;
            margin-left: 8px;
            background: linear-gradient(135deg, #fff 0%, #a78bfa 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .footer-brand p {
            font-size: 14px;
            margin-top: 8px;
        }
        
        .footer-links {
            display: flex;
            gap: 24px;
        }
        
        .footer-links a {
            color: rgba(255, 255, 255, 0.7);
            text-decoration: none;
            transition: color 0.2s;
        }
        
        .footer-links a:hover {
            color: white;
        }
        
        .footer-copyright {
            font-size: 12px;
            opacity: 0.6;
        }
        
        @media (max-width: 768px) {
            .footer {
                padding: 30px 0 20px;
            }
            
            .footer-links {
                flex-wrap: wrap;
                justify-content: center;
                gap: 16px;
            }
        }
    `]
})
export class FooterComponent { }