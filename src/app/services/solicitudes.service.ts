import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import Swal from "sweetalert2";
import {
  CantPerStatus,
  CustomResult,
  PostRequest,
  RequesByDate,
} from "../interfaces/interfaces";
import { Estadistics, Solicitud } from "../interfaces/solicitud";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class SolicitudesService {
  private _newReques: PostRequest = { limit: 100, offset: 0 };

  constructor(private http: HttpClient, private authServ: AuthService) {}

  //Crear Una Solicitud
  createSolicitud(nuevaSolicitud: Solicitud) {
    return this.http
      .post<Solicitud>(`${environment.apiUrl}/request/create`, nuevaSolicitud)
      .pipe(
        map((res: Solicitud) => {
          return res;
        }),
        catchError((err) => this.handlerError(err))
      );
  }

  ///Todas las solicitudes del usuario logueado
  getSolicitudes(postReques?: PostRequest) {
    if (postReques) {
      this._newReques = postReques;
    }
    return this.http
      .post<CustomResult>(`${environment.apiUrl}/request`, this._newReques)
      .pipe(
        map((res: CustomResult) => {
          return res;
        }),
        catchError((err) => this.handlerError(err))
      );
  }

  // Cantidad x status

  ///Todas las solicitudes del Tecnico logueado
  getSolicitudesXtecnico(postReques?: PostRequest) {
    if (postReques) {
      this._newReques = postReques;
    }
    return this.http
      .post<CustomResult>(
        `${environment.apiUrl}/request/bytechnician`,
        this._newReques
      )
      .pipe(
        map((res: CustomResult) => {
          return res;
        }),
        catchError((err) => this.handlerError(err))
      );
  }

  //Acciones para las solicitudes

  //Despachar
  dispatchSolicitud(_solicitudID: number, body) {
    return this.http
      .put<Solicitud>(
        `${environment.apiUrl}/request/dispatch/${_solicitudID}`,
        body
      )
      .pipe(
        map((res: Solicitud) => {
          return res;
        }),
        catchError((err) => this.handlerError(err))
      );
  }
  //Cerrar
  closeSolicitud(_solicitudID: number, body) {
    return this.http
      .put<Solicitud>(
        `${environment.apiUrl}/request/close/${_solicitudID}`,
        body
      )
      .pipe(
        map((res: Solicitud) => {
          return res;
        }),
        catchError((err) => this.handlerError(err))
      );
  }

  //Procesar
  processSolicitud(_solicitudID: number) {
    return this.http
      .put<CustomResult>(
        `${environment.apiUrl}/request/procces/${_solicitudID}`,
        null
      )
      .pipe(
        map((res: CustomResult) => {
          return res;
        }),
        catchError((err) => this.handlerError(err))
      );
  }

  //Delegar Solicitud
  delegateSolicitud(_solicitudID: number, _idTec: number) {
    return this.http
      .put<CustomResult>(
        `${environment.apiUrl}/request/delegate/${_solicitudID}/${_idTec}`,
        null
      )
      .pipe(
        map((res: CustomResult) => {
          console.log(res);
          return res;
        }),
        catchError((err) => this.handlerError(err))
      );
  }

  //Con filtros
  getSolicitudesbyDate(postReques?: RequesByDate) {
    return this.http
      .post<Estadistics[]>(`${environment.apiUrl}/request/filter`, postReques)
      .pipe(
        map((res: Estadistics[]) => {
          return res;
        }),
        catchError((err) => this.handlerError(err))
      );
  }

  //Errores
  private handlerError(err): Observable<never> {
    let status = err.status;
    let mensaje = "";
    switch (status) {
      case 400:
        if (err.error.message == "Tienes una solicitud similar, en proceso") {
          mensaje = "Usted ya tiene una solicitud similar";
        } else if (
          err.error.message.includes(
            "En estos momentos no podemos atender solicitudes en"
          )
        ) {
          mensaje = err.error.message;
        } else {
          mensaje = "Datos incorrectos";
        }

        break;
      case 401:
        break;
      case 0:
        mensaje = "Servidor no encontrado";
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
