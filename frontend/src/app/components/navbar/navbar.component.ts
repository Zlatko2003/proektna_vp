import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
    selector: 'app-navbar',
    template: `
        <nav class="navbar">
            <div class="container">
                <div class="nav-brand">
                    <a routerLink="/">DevQ&A</a>
                </div>
                <button class="mobile-menu-btn" (click)="toggleMenu()">☰</button>
                <div class="nav-links" [class.active]="menuOpen">
                    <a routerLink="/questions" (click)="menuOpen = false">Questions</a>
                    <a routerLink="/ask" *ngIf="isAuthenticated" (click)="menuOpen = false">Ask Question</a>
                    <a routerLink="/profile" *ngIf="isAuthenticated" (click)="menuOpen = false">Profile</a>
                    <a routerLink="/admin" *ngIf="isAdmin" (click)="menuOpen = false">Admin</a>
                    <a routerLink="/login" *ngIf="!isAuthenticated" (click)="menuOpen = false">Login</a>
                    <a routerLink="/register" *ngIf="!isAuthenticated" (click)="menuOpen = false">Register</a>
                    <button (click)="logout()" *ngIf="isAuthenticated" class="btn-logout">Logout</button>
                </div>
            </div>
        </nav>
        <style>
            .navbar {
                background: var(--dark);
                color: white;
                padding: 15px 0;
                position: sticky;
                top: 0;
                z-index: 1000;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            
            .navbar .container {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .nav-brand a {
                color: white;
                font-size: 24px;
                font-weight: bold;
                text-decoration: none;
                background: linear-gradient(135deg, #fff 0%, #3498db 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            
            .nav-links {
                display: flex;
                align-items: center;
                gap: 20px;
            }
            
            .nav-links a {
                color: white;
                text-decoration: none;
                transition: var(--transition);
            }
            
            .nav-links a:hover {
                color: var(--primary-color);
            }
            
            .btn-logout {
                background: rgba(231, 76, 60, 0.8);
                border: none;
                color: white;
                padding: 8px 16px;
                border-radius: 5px;
                cursor: pointer;
                transition: var(--transition);
            }
            
            .btn-logout:hover {
                background: var(--danger-color);
            }
            
            .mobile-menu-btn {
                display: none;
                background: none;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
            }
            
            @media (max-width: 768px) {
                .mobile-menu-btn {
                    display: block;
                }
                
                .nav-links {
                    display: none;
                    position: absolute;
                    top: 60px;
                    left: 0;
                    right: 0;
                    background: var(--secondary-color);
                    flex-direction: column;
                    padding: 20px;
                    gap: 15px;
                }
                
                .nav-links.active {
                    display: flex;
                }
            }
        </style>
    `
})
export class NavbarComponent implements OnInit {
    isAuthenticated = false;
    isAdmin = false;
    user: User | null = null;
    menuOpen = false;

    constructor(private authService: AuthService) { }

    ngOnInit(): void {
        this.authService.user$.subscribe(user => {
            this.user = user;
            this.isAuthenticated = !!user;
            this.isAdmin = user?.role === 'admin';
        });
    }

    toggleMenu(): void {
        this.menuOpen = !this.menuOpen;
    }

    logout(): void {
        this.authService.logout();
        this.menuOpen = false;
    }
}