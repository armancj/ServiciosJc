import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { LOCALE_ID, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { RouterModule } from "@angular/router";

import { AppComponent } from "./app.component";
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { AuthLayoutComponent } from "./layouts/auth-layout/auth-layout.component";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { AppRoutingModule } from "./app.routing";
import { ComponentsModule } from "./components/components.module";
import { MaterialModule } from "./material/material.module";
import { NgxDropzoneModule } from "ngx-dropzone";
import { BrowserModule } from "@angular/platform-browser";
import { NgxSpinnerModule } from "ngx-spinner";
import { WINDOW_PROVIDERS } from "./window-token";
import { JwtHelperService, JWT_OPTIONS } from "@auth0/angular-jwt";
import { AuthInterceptorService } from "./interceptors/auth-interceptor.service";

import { HttpClient } from "@angular/common/http";
import {
  TranslateModule,
  TranslateLoader,
  TranslateService,
} from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { ImageCropperModule } from "ngx-image-cropper";

import { SpinnerModule } from "./components/spinner/spinner.module";
import { SpinnerInterceptor } from "./interceptors/spinner.interceptor";

import { NgsRevealModule } from "ngx-scrollreveal";

import { registerLocaleData } from "@angular/common";
import localeEsAr from "@angular/common/locales/es-AR";
import { AngularCropperjsModule } from "angular-cropperjs";
import { CropperImgModule } from "./components/cropper-img/cropper-img.module";
import { InicioComponent } from "./pages/inicio/inicio.component";
import { LandingpageComponent } from "./layouts/landing/landingpage/landingpage.component";

import { environment } from "src/environments/environment.prod";

registerLocaleData(localeEsAr, "es-Ar");

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "assets/i18n", ".json");
}

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    AngularCropperjsModule,
    HttpClientModule,
    CropperImgModule,
    ComponentsModule,
    NgbModule,
    RouterModule,
    ImageCropperModule,
    AppRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    NgsRevealModule,
    FormsModule,
    NgxDropzoneModule,
    BrowserModule,
    SpinnerModule,
    SweetAlert2Module.forRoot(),
    NgxSpinnerModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    InicioComponent,
    LandingpageComponent,
  ],
  providers: [
    WINDOW_PROVIDERS,
    JwtHelperService,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    { provide: LOCALE_ID, useValue: "es-Ar" },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SpinnerInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
