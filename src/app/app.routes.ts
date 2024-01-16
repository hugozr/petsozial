import { Routes } from '@angular/router';
import { LoginComponent } from './modules/security/login/login.component';
import { WelcomeComponent } from './panels/welcome/welcome.component';
import { FavoritesComponent } from './panels/favorites/favorites.component';
import { NotificationsComponent } from './panels/notifications/notifications.component';
import { AlertToUserComponent } from './navigation/alert-to-user/alert-to-user.component';

export const routes: Routes = [
    { path: "", component: WelcomeComponent},
    { path: "login", component: LoginComponent  },
    { path: "alerts", component: AlertToUserComponent  },
    { path: "favorites", component: FavoritesComponent  },
    { path: "notifications", component: NotificationsComponent  },
    { path: "users", loadChildren: () => import("./modules/security/security.module").then(x => x.SecurityModule)  },
    { path: "master", loadChildren: () => import("./modules/master/master.module").then(x => x.MasterModule)  },
    { path: "pet-care", loadChildren: () => import("./modules/pet-care/pet-care.module").then(x => x.PetCareModule)  },
    { path: "pet-health", loadChildren: () => import("./modules/pet-health/pet-health.module").then(x => x.PetHealthModule)  },
    { path: "community", loadChildren: () => import("./modules/community/community.module").then(x => x.CommunityModule)  },
    { path: "security", loadChildren: () => import("./modules/security/security.module").then(x => x.SecurityModule)  },
    { path: "locations", loadChildren: () => import("./modules/locations/locations.module").then(x => x.LocationsModule)  },
    { path: "my-pets", loadChildren: () => import("./modules/my-pets/my-pets.module").then(x => x.MyPetsModule)  },
];
