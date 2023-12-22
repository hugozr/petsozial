import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { KeycloakService } from 'keycloak-angular';

function initializeKeycloak(keycloak: KeycloakService) {
  // https://levelup.gitconnected.com/keycloak-in-angular-application-980260b4b196
  return () =>
    keycloak.init({
      config: {
        url: 'http://localhost:8080',
        realm: 'petzocial',
        clientId: 'petzocial'
      },
      initOptions: {
        onLoad: 'check-sso',    //HZUMAETA: Si le pongo login-required lo primero que hace es pedir login desde Keycloak
        silentCheckSsoRedirectUri:
          window.location.origin + '/assets/silent-check-sso.html'
      }
    });
}

export const appConfig: ApplicationConfig = {
  //HZUMAETA: provideHttpClient sirve para traer a los proveedores
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService]
    },
    KeycloakService
  ]
};
