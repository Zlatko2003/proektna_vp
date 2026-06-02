import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tag } from '../models/tag.model';

import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TagService {
    private apiUrl = `${environment.apiUrl}/api/tags`;

    constructor(private http: HttpClient) { }

    getAllTags(): Observable<Tag[]> {
        return this.http.get<Tag[]>(this.apiUrl);
    }

    getPopularTags(): Observable<Tag[]> {
        return this.http.get<Tag[]>(`${this.apiUrl}/popular`);
    }
}