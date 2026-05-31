import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private apiUrl = 'http://localhost:5000/api/auth';
    private tokenKey = 'token';
    private userSubject = new BehaviorSubject<User | null>(null);
    user$ = this.userSubject.asObservable();
    private errorSubject = new BehaviorSubject<string | null>(null);
    error$ = this.errorSubject.asObservable();

    constructor(private http: HttpClient) {
        const token = this.getToken();
        if (token) {
            this.getMe().subscribe();
        }
    }

    private handleError(error: HttpErrorResponse): Observable<never> {
        let errorMessage = 'An error occurred';
        if (error.error && error.error.error) {
            errorMessage = error.error.error;
        } else if (error.message) {
            errorMessage = error.message;
        }
        this.errorSubject.next(errorMessage);
        return throwError(() => new Error(errorMessage));
    }

    register(name: string, email: string, password: string): Observable<any> {
        this.errorSubject.next(null);
        return this.http.post(`${this.apiUrl}/register`, { name, email, password })
            .pipe(
                tap((res: any) => {
                    localStorage.setItem(this.tokenKey, res.token);
                    this.userSubject.next(res.user);
                    this.errorSubject.next(null);
                }),
                catchError(this.handleError.bind(this))
            );
    }

    login(email: string, password: string): Observable<any> {
        this.errorSubject.next(null);
        return this.http.post(`${this.apiUrl}/login`, { email, password })
            .pipe(
                tap((res: any) => {
                    localStorage.setItem(this.tokenKey, res.token);
                    this.userSubject.next(res.user);
                    this.errorSubject.next(null);
                }),
                catchError(this.handleError.bind(this))
            );
    }

    logout(): void {
        localStorage.removeItem(this.tokenKey);
        this.userSubject.next(null);
        this.errorSubject.next(null);
    }

    getMe(): Observable<any> {
        return this.http.get(`${this.apiUrl}/me`).pipe(
            tap((user: any) => {
                this.userSubject.next(user);
            }),
            catchError((err) => {
                this.logout();
                return throwError(() => err);
            })
        );
    }

    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    isAdmin(): boolean {
        const user = this.userSubject.value;
        return user?.role === 'admin';
    }

    clearError(): void {
        this.errorSubject.next(null);
    }
}