import { Routes } from '@angular/router';
import { LoginComponent } from './modules/security/login/login.component';

export const routes: Routes = [
    { path: "", redirectTo: "login", pathMatch: "full"  },
    { path: "login", component: LoginComponent  },
    { path: "users", loadChildren: () => import("./modules/security/security.module").then(x => x.SecurityModule)  },
    { path: "master", loadChildren: () => import("./modules/master/master.module").then(x => x.MasterModule)  },
    { path: "pet-care", loadChildren: () => import("./modules/pet-care/pet-care.module").then(x => x.PetCareModule)  },
    { path: "pet-health", loadChildren: () => import("./modules/pet-health/pet-health.module").then(x => x.PetHealthModule)  },
    { path: "community", loadChildren: () => import("./modules/community/community.module").then(x => x.CommunityModule)  },
];
