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
    ){}

  ngOnInit(): void {
    //this.initLogged();
  }

  public login(){
     this._keycloakService.login();
  }

  getToken(){
    return this._keycloakService.getToken();
  }

  getUserName (){
    const keycloakInstance = this.getInstance();
    if (keycloakInstance.tokenParsed) return keycloakInstance.tokenParsed!['preferred_username']; 
    return undefined;
  }

  getUserId (){
    const keycloakInstance = this.getInstance();
    if (keycloakInstance.tokenParsed) return keycloakInstance.tokenParsed!['sid']; 
    return undefined;
  }

  getUserEmail (){
    const keycloakInstance = this.getInstance();
    if (keycloakInstance.tokenParsed) return keycloakInstance.tokenParsed!['email']; 
    return undefined;
  }

  getRoles(): any {
    const roles: any = this._keycloakService.getUserRoles(true);
    console.log('Roles del usuario:', roles);
    return roles;
  }

  hasRole(role: string){
    const roles = this.getRoles();
    return roles.includes(role);
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
