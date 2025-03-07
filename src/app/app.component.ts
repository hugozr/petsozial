import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './navigation/navigation.component';
import {} from '@angular/common/http';
// import { KeycloakAngularModule } from 'keycloak-angular';


@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    CommonModule, 
    RouterOutlet, 
    NavigationComponent,
    
// TODO: `HttpClientModule` should not be imported into a component directly.
// Please refactor the code to add `provideHttpClient()` call to the provider list in the
// application bootstrap logic and remove the `HttpClientModule` import from this component.
// HttpClientModule,
    // KeycloakAngularModule
  ],
})
export class AppComponent {
  title = 'Petzocial';
}
