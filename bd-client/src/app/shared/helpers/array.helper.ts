export class ArrayHelper {
  public static groupBy<T>(array: T[], fn: (item?: T) => any): { [key: string]: T[] } {
    return array.reduce((groupedArray, item) => {
      (groupedArray[fn(item)] = groupedArray[fn(item)] || []).push(item);
      return groupedArray;
    }, {} as { [key: string]: T[] });
  }

  public static unique<T>(array: T[], fn: (item?: T) => any) {
    const flags: boolean[] = [];
    const output: T[] = [];
    const l = array.length;

    for (let i = 0; i < l; i++) {
      if (flags[fn(array[i])]) {
        continue;
      }
      flags[fn(array[i])] = true;
      output.push(array[i]);
    }

    return output;
  }

  public static sortAlphaNumeric<T extends { [key: string]: any }>(items: T[], key: string) {
    return items.sort((a, b) => a[key].localeCompare(b[key], 'en', { numeric: true }));
  }
}
