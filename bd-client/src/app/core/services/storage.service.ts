import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly STORAGE_PREFIX = 'bd';

  public get<T>(key: string): T {
    const value = localStorage.getItem(this.getFormattedKey(key));
    if (typeof value === 'undefined') {
      return value;
    }

    try {
      return JSON.parse(value) as T;
    } catch (e) {
      if (typeof value === 'string') {
        return value as any;
      }

      console.log(`Error when getting localStorage value for the '${this.getFormattedKey(key)}' key.`, e);
      return null;
    }
  }

  public getMap<K, V>(key: string): Map<K, V> {
    try {
      const data = this.get<any[]>(key);
      return data ? new Map<K, V>(data) : null;
    } catch (e) {
      console.log(`Error when getting localStorage Map value for the '${this.getFormattedKey(key)}' key.`, e);
      return null;
    }
  }

  public set(key: string, value: any) {
    const isObject = typeof value === 'object' && value !== null;
    localStorage.setItem(this.getFormattedKey(key), isObject ? JSON.stringify(value) : value);
  }

  private getFormattedKey(key: string) {
    return `${this.STORAGE_PREFIX}-${key}`;
  }
}
