import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './navigation/navigation.component';
import { HttpClientModule } from '@angular/common/http';
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
    HttpClientModule,
    // KeycloakAngularModule
  ],
})
export class AppComponent {
  title = 'Petzocial';
}
