import { inject, Injectable } from '@angular/core';
// import { KeycloakService } from 'keycloak-angular';
import Keycloak from 'keycloak-js';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // keycloakUser: any = null;
  userLoggedIn = false;
  tokenParsed: any; 
  userName!: string;
  private readonly _keycloak = inject(Keycloak);

  // constructor(private _keycloakService: KeycloakService,
  //   ){}

  ngOnInit(): void {
    //this.initLogged();
  }

  public login(){
     this._keycloak.login();
  }

  getToken(){
    // return this._keycloakService.getToken();
  }

  async getUser(): Promise<any> {
    if (this._keycloak?.authenticated) {
      const profile = await this._keycloak.loadUserProfile();

      const user = {
        name: `${profile?.firstName} ${profile.lastName}`,
        email: profile?.email,
        username: profile?.username
      };
      return user
    }
    return null;
  }

  getUserName (): any{
    const keycloakInstance = this.getInstance();
    console.log(keycloakInstance, "aaaaaaaaaa");
    // if (keycloakInstance.tokenParsed) return keycloakInstance.tokenParsed!['preferred_username']; 
    // return undefined;
    return null;
  }

  getFullName() {
    // const keycloakInstance = this.getInstance();
    // if (keycloakInstance.tokenParsed) return keycloakInstance.tokenParsed['name'];
    // return undefined;
    return ""
  }

  getUserId (){
    // const keycloakInstance = this.getInstance();
    // if (keycloakInstance.tokenParsed) return keycloakInstance.tokenParsed!['sid']; 
    // return undefined;
    return ""
  }

  getUserKeycloakId (){
    // const keycloakInstance = this.getInstance();
    // if (keycloakInstance.tokenParsed) return keycloakInstance.tokenParsed!['sub']; 
    // return undefined;
    return ""
  }

  getUserEmail (){

    // const keycloakInstance = this.getInstance();
    // if (keycloakInstance.tokenParsed) return keycloakInstance.tokenParsed!['email']; 
    // return undefined;
    return ""
    
  }

  getRoles(): any {

    // const roles: any = this._keycloakService.getUserRoles(true);
    // return roles;
    return null;
  }

  hasRole(role: string){
    const roles = this.getRoles();
    return roles.includes(role);
  }
  
  getInstance(){
    // return this._keycloakService.getKeycloakInstance(); ccccccccccc
  }

  isLoggedIn(): boolean {
    // return this._keycloakService.isLoggedIn();
    return this._keycloak.userInfo ? true : false;
  }

  logout() {
    this._keycloak.logout();
  }


}
