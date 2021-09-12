export class DataHelper {
  public static formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) {
      return '0 Bytes';
    }

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  public static isEqual(obj1: any, obj2: any) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

  public static removeEmpty(obj: any) {
    return Object.keys({ ...obj })
      .filter((k) => obj[k] != null)
      .reduce((a, k) => ({ ...a, [k]: obj[k] }), {});
  }

  public static hasUnit(num: number) {
    return num === 1 || num.toString(10).includes('1');
  }

  public static saveFile(blob: Blob | string, name: string, type = 'octet/stream') {
    const svgBlob = new Blob([blob], { type });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = name;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }
}
