import { Routes } from "@angular/router";
import { ChangepassEmployeComponent } from "@app/pages/changepass-employe/changepass-employe.component";
import { ChangepassComponent } from "@app/pages/changepass/changepass.component";

import { LoginComponent } from "../../pages/login/login.component";
import { RegisterComponent } from "../../pages/register/register.component";

export const AuthLayoutRoutes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },

  { path: "change_pass", component: ChangepassComponent },
  { path: "change_passEmploy", component: ChangepassEmployeComponent },
];
