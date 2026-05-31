import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filterByTag' })
export class FilterByTagPipe implements PipeTransform {
    transform(items: any[], tag: string): any[] {
        if (!tag || !items) return items;
        return items.filter(item => item.tags?.includes(tag));
    }
}