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
import { OptionsService } from '../services/options.service';
import { AppOption } from '../interfaces/appOption';
import { MyCommunitiesComponent } from '../panels/my-communities/my-communities.component';

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
    MyCommunitiesComponent
  ],
})
export class NavigationComponent implements OnInit{
  private breakpointObserver = inject(BreakpointObserver);
  appOptions: AppOption[] = [];

  constructor(private router: Router, private optionsService: OptionsService) { }


  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  ngOnInit(): void {
    this.loadOptions();
  }

  loadOptions(){
    this.optionsService.getOptions().subscribe( (data: any) => {
      data.docs.map( (elem: any) => {
        this.appOptions.push({name: elem.name, redirect: elem.redirect});
      });
      console.log(this.appOptions);
    })
  }

  openLogin() {
    console.log('abriendo login');
  }
}
