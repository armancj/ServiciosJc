import { Injectable } from "@angular/core";
import { Observable, Subject, throwError } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { JwtHelperService } from "@auth0/angular-jwt";
import Swal from "sweetalert2";
import {
  DatosAuth,
  Login,
  ResponseLogin,
  ResponseLogout,
} from "../interfaces/auth";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { stringify } from "@angular/compiler/src/util";
import { Router } from "@angular/router";
import { CustomResult } from "@app/interfaces/interfaces";
import { Empleado } from "@app/interfaces/empleado";
import { Usuario } from "@app/interfaces/user";
const helper = new JwtHelperService();

@Injectable({
  providedIn: "root",
})
export class AuthService {
  _logtypeEmployee = new Subject<boolean>();
  _userLog$ = new Subject<Usuario>();
  _datos: DatosAuth = { Role: "", isLoged: false };
  _tempruta: string = "/inicio";
  constructor(private http: HttpClient, private _router: Router) {
    if (localStorage.getItem("logged")) {
      this._datos.isLoged = JSON.parse(localStorage.getItem("logged"));
    }
  }

  getToken() {
    return localStorage.getItem("tokenServicios");
  }

  getRefreshToken() {
    return localStorage.getItem("tokenrefr");
  }

  get isLogged() {
    if (localStorage.getItem("logged")) {
      this._datos.isLoged = JSON.parse(localStorage.getItem("logged"));
      this._datos.Role = JSON.parse(localStorage.getItem("rol"));
    }
    return this._datos;
  }

  login(flogin: Login) {
    return this.http
      .post<ResponseLogin>(`${environment.apiUrl}/users/login`, flogin)
      .pipe(
        map((res: ResponseLogin) => {
          this._datos.isLoged = true;
          this.saveData(res);
          this._userLog$.next(res.user);

          return res;
        }),
        catchError((err) => this.handlerError(err))
      );
  }

  getProfile() {
    return this.http
      .get<CustomResult>(`${environment.apiUrl}/users/getprofile`)
      .pipe(
        map((res: CustomResult) => {
          this._userLog$.next(res.result);
          return res.result;
        }),
        catchError((err) => this.handlerError(err))
      );
  }

  private saveData(data: ResponseLogin) {
    this._datos.Role = helper.decodeToken(data.access_token).rol;
    localStorage.setItem("tokenServicios", data.access_token);
    if (data.refresh_token) {
      localStorage.setItem("tokenrefr", data.refresh_token);
    }

    localStorage.setItem("logged", JSON.stringify(this._datos.isLoged));
    localStorage.setItem("rol", JSON.stringify(this._datos.Role));
  }

  logout() {
    return this.http
      .get<ResponseLogout>(`${environment.apiUrl}/users/logout`)
      .pipe(
        map((res: ResponseLogout) => {
          localStorage.removeItem("tokenServicios");
          localStorage.removeItem("tokenrefr");
          localStorage.removeItem("logged");
          localStorage.removeItem("rol");
          this._datos.isLoged = false;
          this._logtypeEmployee.next(false);

          return res;
        }),
        catchError((err) => this.handlerError(err))
      );
  }

  logoutE() {
    return this.http
      .get<ResponseLogout>(`${environment.apiUrl}/employee/logout`)
      .pipe(
        map((res: ResponseLogout) => {
          localStorage.removeItem("tokenServicios");
          localStorage.removeItem("tokenrefr");
          localStorage.removeItem("logged");
          localStorage.removeItem("rol");
          this._datos.isLoged = false;
          this._logtypeEmployee.next(false);
          return res;
        }),
        catchError((err) => this.handlerError(err))
      );
  }

  forceLogout() {
    localStorage.removeItem("tokenServicios");
    localStorage.removeItem("tokenrefr");
    localStorage.removeItem("logged");
    localStorage.removeItem("rol");
    localStorage.removeItem("logtypeEmploye");
    this._datos.isLoged = false;
    this._logtypeEmployee.next(false);
    this._router.navigate(["/login"]);
  }

  checkToken() {
    const userToken = localStorage.getItem("tokenServicios");
    const isExpired = helper.isTokenExpired(userToken);
    if (isExpired) {
      localStorage.removeItem("tokenServicios");
    }
  }

  refreshToken() {
    return this.http
      .post<any>(`${environment.apiUrl}/users/refresh`, {
        refresh_token: this.getRefreshToken(),
      })
      .pipe(
        map((tokens: ResponseLogin) => {
          localStorage.setItem("tokenServicios", tokens.access_token);
        })
      );
  }

  private handlerError(err): Observable<never> {
    let status = err.status;
    let mensaje = "";

    switch (status) {
      case 400:
        mensaje = "Datos incorrectos";
        break;
      case 404:
        mensaje = "Usuario no encontrado";
        break;
      case 401:
        mensaje = "Credenciales Incorrectas para esta accion";
        break;
      case 0:
        mensaje = "Servidor no encontrado";
        break;
    }
    Swal.fire("Error!", mensaje, "error");

    return throwError(err.message);
  }
}
