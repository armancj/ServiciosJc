import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable, Subject, throwError } from "rxjs";
import { environment } from "src/environments/environment";
import { Servicio } from "../interfaces/servicio";
import { catchError, map } from "rxjs/operators";
import Swal from "sweetalert2";
import { CustomResult } from "../interfaces/interfaces";
import { NumericLiteral } from "typescript";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class ServicioService {
  _formServicio: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private authServ: AuthService
  ) {
    this._formServicio = formBuilder.group({
      id: [0],
      name: ["", Validators.required],
      status: [""],
      summary: [""],
      description: ["", Validators.required],
      enterprisePrice: [0],
      price: [0, [Validators.required]],
      measure: ["", Validators.required],
      service_to: ["", Validators.required],
      picture: [""],
    });
  }
  ///Todos
  getServices() {
    return this.http.get<Servicio[]>(`${environment.apiUrl}/service`).pipe(
      map((res: Servicio[]) => {
        return res;
      }),
      catchError((err) => this.handlerError(err))
    );
  }

  getMyServices() {
    return this.http
      .get<Servicio[]>(`${environment.apiUrl}/service/myservices`)
      .pipe(
        map((res: Servicio[]) => {
          return res;
        }),
        catchError((err) => this.handlerError(err))
      );
  }

  //por municipios
  getServicesAdmin() {
    return this.http
      .get<Servicio[]>(`${environment.apiUrl}/service/admin/list`)
      .pipe(
        map((res: Servicio[]) => {
          return res;
        }),
        catchError((err) => this.handlerError(err))
      );
  }

  getServicesByMunicipes(idmunicipe: number) {
    return this.http
      .get<Servicio[]>(`${environment.apiUrl}/service/bymunicipe/${idmunicipe}`)
      .pipe(
        map((res: Servicio[]) => {
          return res;
        }),
        catchError((err) => this.handlerError(err))
      );
  }

  //por el municipio

  ///Crear
  createService(nuevoServicio: Servicio) {
    return this.http
      .post<Servicio>(`${environment.apiUrl}/service/create`, nuevoServicio)
      .pipe(
        map((res: Servicio) => {
          return res;
        }),
        catchError((err) => this.handlerError(err))
      );
  }

  //Eliminar
  deleteServicio(id: number) {
    return this.http
      .delete<CustomResult>(`${environment.apiUrl}/service/delete/${id}`)
      .pipe(
        map((res: CustomResult) => {
          return res;
        }),
        catchError((err) => this.handlerError(err))
      );
  }

  //Editar
  editServicio(serv: Servicio) {
    return this.http
      .put<CustomResult>(
        `${environment.apiUrl}/service/update/${serv.id}`,
        serv
      )
      .pipe(
        map((res: CustomResult) => {
          return res;
        }),
        catchError((err) => this.handlerError(err))
      );
  }

  //Imagen
  uploadImage(formData: FormData, idserv?: number): Observable<any> {
    return this.http.post<FormData>(
      `${environment.apiUrl}/service/uploadImage/${idserv}`,
      formData,
      {
        reportProgress: true,
        observe: "events",
      }
    );
  }

  crearFormulario(servicio?: Servicio) {
    if (servicio) {
      this._formServicio.patchValue(servicio);
      return this._formServicio;
    }
    return this._formServicio;
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
