import { Pipe, PipeTransform } from '@angular/core';

import { DataHelper } from '../helpers/data.helper';

@Pipe({ name: 'formatBytes' })
export class FormatBytesPipe implements PipeTransform {
  public transform(value: number, decimals = 2) {
    return DataHelper.formatBytes(value, decimals);
  }
}
