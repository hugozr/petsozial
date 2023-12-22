import { Injectable } from '@angular/core';
import { EncryptService } from './encrypt.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private _encryptSrvice: EncryptService
  ) { }

  get length(): number {
    return sessionStorage.length;
  }

  clear(): void {
    sessionStorage.clear();
  }
  
  setItem(key: string, value: Object): void {
    let data = this._encryptSrvice.encryptData(value);
    sessionStorage.setItem(key, data);
  }

  getItem<T>(key: string): T {
    const data = sessionStorage.getItem(key);
    if (data !== null) {
      return this._encryptSrvice.decryptData<T>(data) as T;
    }
    return null as T;
  }

  key(index: number): string | null {
    return sessionStorage.key(index);
  }

  removeItem(key: string): void {
    sessionStorage.removeItem(key);
  }
}
