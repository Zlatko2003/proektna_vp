import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GithubService {
    private apiUrl = `${environment.apiUrl}/api/github`;

    constructor(private http: HttpClient) { }

    searchRepos(tag: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/search?tag=${tag}`);
    }
}