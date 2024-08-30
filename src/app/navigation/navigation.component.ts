import { Component, OnInit, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AsyncPipe, CommonModule, NgIf } from '@angular/common';
import { WelcomeComponent } from '../panels/welcome/welcome.component';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { PortalService } from '../services/portal.service';
import { AppOption } from '../interfaces/appOption';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';

//https://stackoverflow.com/questions/44725980/angular-2-material-design-multi-select-drop-down-with-hierarchical-indentation
//TODO: Investigar multiselect

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    NgIf,
    WelcomeComponent,
    RouterLink,
    RouterOutlet,
    CommonModule,
  ],
})
export class NavigationComponent {
  private breakpointObserver = inject(BreakpointObserver);
  appOptions: AppOption[] = [];

  // userLoggedIn = false;
  tokenParsed: any;
  userName!: string;

  constructor(
    private portalService: PortalService,
    private _authService: AuthService,
    private usersService: UsersService,
    ) { }

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  ngOnInit(): void {
    this.initLogged();
    this.loadOptions();
  }

  async initLogged(){
    if (this._authService.isLoggedIn()) {
      this.userName = this._authService.getUserName();
      console.log(this._authService.getUserId(), "user id debo buscar y si no hay, debo crearlo");
      const user = await this.usersService.syncronizeWithAppUser(this._authService.getUserKeycloakId(), this._authService.getUserName(), this._authService.getUserEmail());
    }
  }

  public login(){
    this._authService.login();
  }
  public logout(){
    this._authService.logout();
  }

  loadOptions(){
    this.portalService.getOptions().subscribe( (data: any) => {
      data.docs.map( (elem: any) => {
        this.appOptions.push({
          name: elem.name, 
          redirect: elem.redirect ,
          rqUserLoggedIn: elem.rqUserLoggedIn });
      });
    })
  }

  logInOut() {
    if(this.userName) this._authService.logout()
    else this._authService.login();
  }
}
