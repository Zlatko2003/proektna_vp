import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private apiUrl = `${environment.apiUrl}/api/auth`;
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

    private mapUser(u: any): User | null {
        if (!u) return null;
        return {
            id: u.id || u._id,
            name: u.name,
            email: u.email,
            role: u.role,
            createdAt: u.createdAt,
            bio: u.bio || '',
            location: u.location || '',
            reputation: u.reputation ?? 0
        };
    }

    private handleError(error: HttpErrorResponse): Observable<never> {
        let errorMessage = 'An error occurred';
        if (error.error && error.error.error) {
            errorMessage = error.error.error;
        } else if (error.message) {
            errorMessage = error.message;
        }
        this.errorSubject.next(errorMessage);
        return throwError(() => error);
    }

    register(name: string, email: string, password: string): Observable<any> {
        this.errorSubject.next(null);
        return this.http.post(`${this.apiUrl}/register`, { name, email, password }).pipe(
            tap((res: any) => {
                if (res?.email) {
                    sessionStorage.setItem('pendingVerifyEmail', res.email);
                }
                this.errorSubject.next(null);
            }),
            catchError(this.handleError.bind(this))
        );
    }

    verifyEmail(email: string, code: string): Observable<any> {
        this.errorSubject.next(null);
        return this.http.post(`${this.apiUrl}/verify`, { email, code }).pipe(
            tap((res: any) => {
                localStorage.setItem(this.tokenKey, res.token);
                this.userSubject.next(this.mapUser(res.user));
                sessionStorage.removeItem('pendingVerifyEmail');
                this.errorSubject.next(null);
            }),
            catchError(this.handleError.bind(this))
        );
    }

    resendCode(email: string): Observable<any> {
        this.errorSubject.next(null);
        return this.http.post(`${this.apiUrl}/resend-code`, { email }).pipe(
            catchError(this.handleError.bind(this))
        );
    }

    login(email: string, password: string): Observable<any> {
        this.errorSubject.next(null);
        return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
            tap((res: any) => {
                localStorage.setItem(this.tokenKey, res.token);
                this.userSubject.next(this.mapUser(res.user));
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
                this.userSubject.next(this.mapUser(user));
            }),
            catchError((err: HttpErrorResponse) => {
                if (err.status === 401) {
                    this.logout();
                }
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

    updateProfile(data: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/profile`, data).pipe(
            tap((user: any) => {
                this.userSubject.next(this.mapUser(user));
            }),
            catchError(this.handleError.bind(this))
        );
    }

    getAllUsers(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/users`).pipe(
            catchError(this.handleError.bind(this))
        );
    }
}