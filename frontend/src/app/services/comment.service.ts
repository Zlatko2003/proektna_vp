import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../models/comment.model';

@Injectable({ providedIn: 'root' })
export class CommentService {
    private apiUrl = 'http://localhost:5000/api/comments';

    constructor(private http: HttpClient) { }

    getComments(parentType: string, parentId: string): Observable<Comment[]> {
        return this.http.get<Comment[]>(`${this.apiUrl}/${parentType}/${parentId}`);
    }

    createComment(content: string, parentType: string, parentId: string): Observable<Comment> {
        return this.http.post<Comment>(this.apiUrl, { content, parentType, parentId });
    }

    deleteComment(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}