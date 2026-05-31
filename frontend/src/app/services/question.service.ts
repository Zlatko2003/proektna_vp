import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Question } from '../models/question.model';

@Injectable({ providedIn: 'root' })
export class QuestionService {
    private apiUrl = 'http://localhost:5000/api/questions';
    private errorSubject = new BehaviorSubject<string | null>(null);
    error$ = this.errorSubject.asObservable();

    constructor(private http: HttpClient) { }

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

    getAllQuestions(page: number = 1, search?: string, tag?: string): Observable<any> {
        let url = `${this.apiUrl}?page=${page}&limit=10`;
        if (search) url += `&search=${search}`;
        if (tag) url += `&tag=${tag}`;
        return this.http.get(url).pipe(catchError(this.handleError.bind(this)));
    }

    getQuestionById(id: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError.bind(this)));
    }

    createQuestion(question: Partial<Question>): Observable<Question> {
        return this.http.post<Question>(this.apiUrl, question).pipe(
            tap(() => this.errorSubject.next(null)),
            catchError(this.handleError.bind(this))
        );
    }

    updateQuestion(id: string, question: Partial<Question>): Observable<Question> {
        return this.http.put<Question>(`${this.apiUrl}/${id}`, question).pipe(
            tap(() => this.errorSubject.next(null)),
            catchError(this.handleError.bind(this))
        );
    }

    deleteQuestion(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`).pipe(
            tap(() => this.errorSubject.next(null)),
            catchError(this.handleError.bind(this))
        );
    }

    clearError(): void {
        this.errorSubject.next(null);
    }
}