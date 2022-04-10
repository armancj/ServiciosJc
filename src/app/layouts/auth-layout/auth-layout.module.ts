import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AuthLayoutRoutes } from "./auth-layout.routing";

import { LoginComponent } from "../../pages/login/login.component";
import { RegisterComponent } from "../../pages/register/register.component";
import { MaterialModule } from "src/app/material/material.module";

import { ChangepassComponent } from "@app/pages/changepass/changepass.component";
import { ChangepassEmployeComponent } from "@app/pages/changepass-employe/changepass-employe.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AuthLayoutRoutes),
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    FontAwesomeModule,
  ],
  declarations: [
    LoginComponent,
    RegisterComponent,

    ChangepassComponent,
    ChangepassEmployeComponent,
  ],
})
export class AuthLayoutModule {}
