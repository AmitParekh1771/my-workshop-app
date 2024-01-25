import { Pipe, PipeTransform } from '@angular/core';
import { SelectItem } from '../models/select-item.model';

@Pipe({
  name: 'itemToString'
})
export class ItemToStringPipe<T extends SelectItem> implements PipeTransform {

  transform(value: T[], ...args: string[]): string {
    if(!value.length) return '';
    return value.map(val => val.name).join(args[0]);
  }

}
