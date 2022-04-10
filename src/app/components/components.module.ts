import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { FooterComponent } from "./footer/footer.component";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MaterialModule } from "../material/material.module";

import {
  TranslateModule,
  TranslateLoader,
  TranslateService,
} from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { HttpClient } from "@angular/common/http";
import { GraficsComponent } from "./grafics/grafics.component";

import { ChartsModule } from "ng2-charts";
import { BarrasComponent } from "./grafics/barras/barras.component";
import { CarouselComponent } from "./landing/carousel/carousel.component";
import { ServiceCardComponent } from "./Card/service/service.component";
import { TableComponent } from "./table/table.component";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DetailsComponent } from "./details/details.component";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "assets/i18n/");
}

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    ChartsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    GraficsComponent,
    BarrasComponent,

    CarouselComponent,
    ServiceCardComponent,
    TableComponent,
    DetailsComponent,
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    GraficsComponent,
    BarrasComponent,
    CarouselComponent,
    ServiceCardComponent,
    TableComponent,
    DetailsComponent,
  ],
})
export class ComponentsModule {}
