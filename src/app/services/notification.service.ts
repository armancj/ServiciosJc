import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import Swal from "sweetalert2";
import { CustomResult } from "../interfaces/interfaces";
import { Notifications } from "../interfaces/notification";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  constructor(private _http: HttpClient, private authServ: AuthService) {}

  getNotificationsTech() {
    return this._http
      .get<Notifications[]>(
        `${environment.apiUrl}/notifications/getByTechnician`
      )
      .pipe(
        map((res: Notifications[]) => {
          return res;
        }),
        catchError((err) => this.handlerError(err))
      );
  }

  getNotificationsClient() {
    return this._http
      .get<Notifications[]>(`${environment.apiUrl}/notifications/getByClient`)
      .pipe(
        map((res: Notifications[]) => {
          return res;
        }),
        catchError((err) => this.handlerError(err))
      );
  }

  readNotifications(id: number) {
    return this._http
      .put<CustomResult>(`${environment.apiUrl}/notifications/read/${id}`, null)
      .pipe(
        map((res: CustomResult) => {
          return res;
        }),
        catchError((err) => this.handlerError(err))
      );
  }

  private handlerError(err): Observable<never> {
    let status = err.status;
    let mensaje = "";
    switch (status) {
      case 400:
        mensaje = "Datos incorrectos";
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
