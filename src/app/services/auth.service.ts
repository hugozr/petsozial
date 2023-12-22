import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userLoggedIn = false;
  tokenParsed: any; 
  userName!: string;

  constructor(private _keycloakService: KeycloakService,
    private storageService: StorageService){}

  ngOnInit(): void {
    this.initLogged();
  }

  initLogged(){
    this.userLoggedIn = this._keycloakService.isLoggedIn();
    this.userName = this._keycloakService.getUsername();
  }

  public login(){
    this._keycloakService.login();
  }

  getToken(){
    return this._keycloakService.getToken();
  }

  isLoggedIn(): boolean {
    return this._keycloakService.isLoggedIn();
  }

  logout() {
    this._keycloakService.logout();
  }
}
