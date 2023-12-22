import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EncryptService {

  private readonly keyEncrypt: string = environment.keyEncrypt;
  
  encryptData(data: Object): string {
    return CryptoJS.AES.encrypt(JSON.stringify(data), this.keyEncrypt).toString();
  }

  decryptData<T>(data: string): T | null {
    const value = CryptoJS.AES.decrypt(data, this.keyEncrypt).toString(CryptoJS.enc.Utf8);
    if (!value) {
      return null;
    }    
    return JSON.parse(value) as T;
  }
}
