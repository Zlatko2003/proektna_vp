import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'sortByDate' })
export class SortByDatePipe implements PipeTransform {
    transform(array: any[], field: string = 'createdAt'): any[] {
        if (!array) return [];
        return [...array].sort((a, b) => {
            return new Date(b[field]).getTime() - new Date(a[field]).getTime();
        });
    }
}