import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                let errorMessage = 'An unknown error occurred';
                
                if (error.error && typeof error.error === 'object') {
                    errorMessage = error.error.error || error.error.message || JSON.stringify(error.error);
                } else if (error.message) {
                    errorMessage = error.message;
                }
                
                console.error('API Error:', errorMessage);
                return throwError(() => new Error(errorMessage));
            })
        );
    }
}