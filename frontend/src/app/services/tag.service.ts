import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tag } from '../models/tag.model';

@Injectable({ providedIn: 'root' })
export class TagService {
    private apiUrl = 'http://localhost:5000/api/tags';

    constructor(private http: HttpClient) { }

    getAllTags(): Observable<Tag[]> {
        return this.http.get<Tag[]>(this.apiUrl);
    }

    getPopularTags(): Observable<Tag[]> {
        return this.http.get<Tag[]>(`${this.apiUrl}/popular`);
    }
}