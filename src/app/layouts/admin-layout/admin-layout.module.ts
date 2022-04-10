import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { ClipboardModule } from "ngx-clipboard";

import { AdminLayoutRoutes } from "./admin-layout.routing";

import { ServiciosComponent } from "src/app/pages/servicios/servicios.component";

import { UserProfileComponent } from "src/app/pages/user-profile/user-profile.component";
import { SolicitudesComponent } from "src/app/pages/solicitudes/solicitudes.component";
import { NgbModalModule, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MaterialModule } from "src/app/material/material.module";
import { NgxDropzoneModule } from "ngx-dropzone";
import { DropzoneModule } from "ngx-dropzone-wrapper";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";

import {
  TranslateModule,
  TranslateLoader,
  TranslateService,
} from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { HttpClient } from "@angular/common/http";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { CropperImgModule } from "@app/components/cropper-img/cropper-img.module";

import { ComponentsModule } from "@app/components/components.module";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "assets/i18n/");
}

@NgModule({
  imports: [
    Ng2SearchPipeModule,
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    ClipboardModule,
    ComponentsModule,
    MaterialModule,
    NgxDropzoneModule,
    CropperImgModule,
    NgbModalModule,
    DropzoneModule,
    SweetAlert2Module,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  declarations: [
    UserProfileComponent,
    SolicitudesComponent,
    ServiciosComponent,
  ],
})
export class AdminLayoutModule {
  constructor(public translate: TranslateService) {
    this.translate.use("es");
  }
}
