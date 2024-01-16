import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userLoggedIn = false;
  tokenParsed: any; 
  userName!: string;

  constructor(private _keycloakService: KeycloakService,
    // private storageService: StorageService
    ){}

  ngOnInit(): void {
    //this.initLogged();
  }

  // initLogged(){
  //   this.userLoggedIn = this._keycloakService.isLoggedIn();
  //   this.userName = this._keycloakService.getUsername();
  //   console.log(this.userName,"555555555555555555555555555555555555555")
  // }

  public login(){
     this._keycloakService.login();
  }

  getToken(){
    return this._keycloakService.getToken();
  }

  getUserName (){
    const keycloakInstance = this.getInstance();
    if (keycloakInstance.tokenParsed) return keycloakInstance.tokenParsed!['preferred_username']; 
    // const userName = keycloakInstance.tokenParsed!['preferred_username'];
    return undefined;
  }

  getInstance(){
    return this._keycloakService.getKeycloakInstance();
  }

  isLoggedIn(): boolean {
    return this._keycloakService.isLoggedIn();
  }

  logout() {
    this._keycloakService.logout();
  }


}
