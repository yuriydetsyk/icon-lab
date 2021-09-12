import { Pipe, PipeTransform } from '@angular/core';

import { TextHelper } from '../helpers/text.helper';

@Pipe({
  name: 'kebabCase',
})
export class KebabCasePipe implements PipeTransform {
  public transform(value: string) {
    return TextHelper.convertToKebabCase(value);
  }
}
