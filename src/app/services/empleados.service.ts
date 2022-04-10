import { HttpClient, HttpHeaders } from "@angular/common/http";
import { EventEmitter, Injectable } from "@angular/core";
import { Empleado } from "../interfaces/empleado";

import { catchError, map } from "rxjs/operators";
import Swal from "sweetalert2";
import {
  CustomResult,
  PostRequest,
  RecoveryPass,
} from "../interfaces/interfaces";
import { environment } from "src/environments/environment";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable, throwError } from "rxjs";
import { UserEdit } from "../interfaces/user";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class EmpleadosService {
  empleadolog$ = new EventEmitter<Empleado>();
  private isValidEmail = /\S+@\S+\.\S+/;
  _newReques: PostRequest = { limit: 100, offset: 0 };
  _formEmployee: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private authServ: AuthService
  ) {
    this._formEmployee = formBuilder.group({
      services: [0],
      jefeGrupo: [0],
      ci: [
        "",
        [
          Validators.required,
          Validators.minLength(11),
          Validators.maxLength(11),
        ],
      ],
      id: [0],
      pendingRequestcount: [0],
      username: ["", Validators.required],
      rol: [""],
      level: [0],
      fullname: ["", Validators.required],
      email: ["", [Validators.required, Validators.pattern(this.isValidEmail)]],
      phone: ["", Validators.required],
      address: ["", Validators.required],
      password: [""],
      municipeID: [0],
      status: [""],
      avatar: [""],
      createdAt: [""],
      updateAt: [""],
      municipe: formBuilder.group({
        id: [0],
        name: [""],
        province: formBuilder.group({
          id: [0],
          name: [""],
          code: [""],
        }),
      }),
    });
  }

  getEmployees(postReques?: PostRequest) {
    if (postReques) {
      this._newReques = postReques;
    }

    return this.http
      .post<CustomResult>(`${environment.apiUrl}/employee`, this._newReques)
      .pipe(
        map((res: CustomResult) => {
          return res;
        }),
        catchError((err) => this.handlerError(err))
      );
  }

  getJfesGrop(postReques?: PostRequest) {
    return this.http
      .get<Empleado[]>(`${environment.apiUrl}/employee/getJefesGrupos`)
      .pipe(
        map((res: Empleado[]) => {
          return res;
        }),
        catchError((err) => this.handlerError(err))
      );
  }

  getTecnicos(postReques?: PostRequest) {
    if (postReques) {
      this._newReques = postReques;
    }

    return this.http
      .get<Empleado[]>(`${environment.apiUrl}/employee/getTecnicos`)
      .pipe(
        map((res: Empleado[]) => {
          return res;
        }),
        catchError((err) => this.handlerError(err))
      );
  }

  //Formulario
  crearFormulario(employee?: Empleado) {
    if (employee) {
      this._formEmployee.patchValue(employee, { emitEvent: true });

      return this._formEmployee;
    }
    return this._formEmployee;
  }

  // Perfil Employee
  obtenerPerfil() {
    return this.http
      .get<CustomResult>(`${environment.apiUrl}/employee/getprofile`)
      .pipe(
        map((res: CustomResult) => {
          return res;
        }),
        catchError((err) => this.handlerError(err))
      );
  }

  //Avatar
  uploadProfileImage(formData: FormData): Observable<any> {
    return this.http.post<FormData>(
      `${environment.apiUrl}/employee/uploadAvatar`,
      formData,
      {
        reportProgress: true,
        observe: "events",
      }
    );
  }

  ///Crear
  createEmployee(nuevoEmpleado: Empleado) {
    return this.http
      .post<Empleado>(`${environment.apiUrl}/employee/create`, nuevoEmpleado)
      .pipe(
        map((res: Empleado) => {
          return res;
        }),
        catchError((err) => this.handlerError(err))
      );
  }

  //Eliminar
  deleteEmployee(id: number) {
    return this.http
      .delete<CustomResult>(`${environment.apiUrl}/employee/delete/${id}`)
      .pipe(
        map((res: CustomResult) => {
          return res;
        }),
        catchError((err) => this.handlerError(err))
      );
  }

  //Editar
  editProfileEmployee(employee: UserEdit) {
    return this.http
      .put<CustomResult>(
        `${environment.apiUrl}/employee/updateprofile`,
        employee
      )
      .pipe(
        map((res: CustomResult) => {
          return res;
        }),
        catchError((err) => this.handlerError(err))
      );
  }

  editEmployee(employee: Empleado) {
    return this.http
      .put<CustomResult>(
        `${environment.apiUrl}/employee/update/${employee.id}`,
        employee
      )
      .pipe(
        map((res: CustomResult) => {
          return res;
        }),
        catchError((err) => this.handlerError(err))
      );
  }

  //Cambiar contraseña paso 1 enviar correo
  EnviarCorreoRecovery(correo: string) {
    return this.http
      .get<CustomResult>(`${environment.apiUrl}/employee/forgot/${correo}`)
      .pipe(
        map((res: CustomResult) => {
          return res;
        }),
        catchError((err) => this.handlerError(err))
      );
  }
  //Cambiar contraseña paso 2 cambiar
  cambiarPass(changform: RecoveryPass) {
    return this.http
      .put<CustomResult>(
        `${environment.apiUrl}/employee/recoverypassword`,
        changform
      )
      .pipe(
        map((res: CustomResult) => {
          return res;
        }),
        catchError((err) => this.handlerError(err))
      );
  }

  //Errores
  private handlerError(err): Observable<never> {
    let status = err.status;
    console.log(err.error.message);

    let mensaje = "";
    switch (status) {
      case 400:
        if (
          err.error.message ==
          "update o delete en «employee» viola la llave foránea «FK_cfe2488103562e16292f091eb22» en la tabla «notification»"
        ) {
          mensaje = "No se Puede Borrar este empleado.";
        } else {
          mensaje = "Datos incorrectos ";
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
