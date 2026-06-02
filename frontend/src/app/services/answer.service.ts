import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Answer } from '../models/answer.model';

import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AnswerService {
    private apiUrl = `${environment.apiUrl}/api/answers`;

    constructor(private http: HttpClient) { }

    createAnswer(questionId: string, content: string): Observable<Answer> {
        return this.http.post<Answer>(`${this.apiUrl}/question/${questionId}`, { content });
    }

    updateAnswer(id: string, content: string): Observable<Answer> {
        return this.http.put<Answer>(`${this.apiUrl}/${id}`, { content });
    }

    deleteAnswer(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    voteAnswer(id: string, vote: 'up' | 'down'): Observable<any> {
        return this.http.patch(`${this.apiUrl}/${id}/vote`, { vote });
    }

    acceptAnswer(id: string): Observable<any> {
        return this.http.patch(`${this.apiUrl}/${id}/accept`, {});
    }
}