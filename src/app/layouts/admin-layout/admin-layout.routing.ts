import { Routes } from "@angular/router";

import { ServiciosComponent } from "../../pages/servicios/servicios.component";
import { UserProfileComponent } from "../../pages/user-profile/user-profile.component";
import { SolicitudesComponent } from "../../pages/solicitudes/solicitudes.component";

import { AuthGuard } from "src/app/guards/auth.guard";
import { DetailsComponent } from "@app/components/details/details.component";

export const AdminLayoutRoutes: Routes = [
  { path: "perfil", component: UserProfileComponent, canActivate: [AuthGuard] },

  {
    path: "solicitudes",
    component: SolicitudesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "servicios",
    component: ServiciosComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "details/:id",
    component: DetailsComponent,
  },
];
