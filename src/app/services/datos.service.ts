import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { JwtHelperService, JwtModule } from "@auth0/angular-jwt";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import Swal from "sweetalert2";
import {
  File,
  municipe,
  province,
  ProvinciaMunicipios,
} from "../interfaces/interfaces";
import jwt_decode from "jwt-decode";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class DatosService {
  private _ProvinciasMunicipes: ProvinciaMunicipios[] = [];
  private _prov: ProvinciaMunicipios;

  constructor(private _http: HttpClient, private authServ: AuthService) {
    this.getProvinces().subscribe((res) => {
      for (let i = 0; i < this._ProvinciasMunicipes.length; i++) {
        this.getMunicipesXprovince(
          this._ProvinciasMunicipes[i].provincia.id
        ).subscribe((value) => {
          this._ProvinciasMunicipes[i].municipes = value;
        });
      }
    });
  }
  get _Provincias() {
    return this._ProvinciasMunicipes;
  }
  //Todas las provincias
  getProvinces() {
    return this._http.get<province[]>(`${environment.apiUrl}/provinces`).pipe(
      map((res: province[]) => {
        for (let i = 0; i < res.length; i++) {
          this._prov = { provincia: res[i] };
          this._ProvinciasMunicipes.push(this._prov);
        }
        return res;
      }),
      catchError((err) => this.handlerError(err))
    );
  }
  //Todos los municipios
  getMunicipes() {
    return this._http.get<municipe[]>(`${environment.apiUrl}/municipes`).pipe(
      map((res: municipe[]) => {
        return res;
      }),
      catchError((err) => this.handlerError(err))
    );
  }

  //Todos los municipios de una Provincia
  getMunicipesXprovince(idProv: number) {
    return this._http
      .get<municipe[]>(`${environment.apiUrl}/municipes/province/${idProv}`)
      .pipe(
        map((res: municipe[]) => {
          return res;
        }),
        catchError((err) => this.handlerError(err))
      );
  }

  //Errores
  private handlerError(err): Observable<never> {
    let status = err.status;
    let mensaje = err.message;

    switch (status) {
      case 400:
        mensaje = "Datos incorrectos";
        break;
      case 401:
        break;
      case 0:
        mensaje = "Servidor no encontrado. Verifique su conexion";

        break;
    }
    Swal.fire("Error!", mensaje, "error").then(() => {
      if (err.status == 0) {
        this.authServ.logout();
      }
    });

    return throwError(err.message);
  }
}
