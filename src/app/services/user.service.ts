import { HttpClient, HttpHeaders } from "@angular/common/http";
import { EventEmitter, Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable, Subject, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import Swal from "sweetalert2";
import {
  CustomResult,
  PostRequest,
  RecoveryPass,
} from "../interfaces/interfaces";
import { UserEdit, Usuario } from "../interfaces/user";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class UserService {
  _formUser: FormGroup;
  _newReques: PostRequest = { limit: 25, offset: 0 };
  private isValidEmail = /\S+@\S+\.\S+/;
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private authServ: AuthService
  ) {
    this._formUser = formBuilder.group({
      id: [0],
      ci: [
        "",
        [
          Validators.required,
          Validators.minLength(11),
          Validators.maxLength(11),
        ],
      ],
      username: [""],
      fullname: ["", Validators.required],
      email: ["", [Validators.pattern(this.isValidEmail), Validators.required]],
      phone: ["", [Validators.required, Validators.minLength(8)]],
      address: ["", Validators.required],
      password: ["", [Validators.minLength(6)]],
      municipeID: [0],
      rol: [""],
      status: [""],
      avatar: [""],
      municipe: formBuilder.group({
        id: [0],
        province: formBuilder.group({
          id: [0],
        }),
      }),
      activateCode: [0],
      createdAt: [""],
      updateAt: [""],
    });
  }

  //Obtener Todos
  getUsers(postReques?: PostRequest) {
    if (postReques) {
      this._newReques = postReques;
    }
    return this.http
      .post<CustomResult>(`${environment.apiUrl}/users`, this._newReques)
      .pipe(
        map((res: CustomResult) => {
          return res;
        }),
        catchError((err) => this.handlerError(err))
      );
  }

  //Crear Usario
  createUser(nuevoUser: Usuario) {
    return this.http
      .post<Usuario>(`${environment.apiUrl}/users/create`, nuevoUser)
      .pipe(
        map((res: Usuario) => {
          return res;
        }),
        catchError((err) => this.handlerError(err))
      );
  }

  //Eliminar
  deleteUser(id: number) {
    return this.http
      .delete<CustomResult>(`${environment.apiUrl}/users/delete/${id}`)
      .pipe(
        map((res: CustomResult) => {
          return res;
        }),
        catchError((err) => this.handlerError(err))
      );
  }

  //Editar
  editUser(user: UserEdit) {
    return this.http
      .put<CustomResult>(`${environment.apiUrl}/users/updateprofile`, user)
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
      `${environment.apiUrl}/users/uploadAvatar`,
      formData,
      {
        reportProgress: true,
        observe: "events",
      }
    );
  }

  //Cambiar contraseña paso 1 enviar correo
  EnviarCorreoRecovery(correo: string) {
    return this.http
      .get<CustomResult>(`${environment.apiUrl}/users/forgot/${correo}`)
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
        `${environment.apiUrl}/users/recoverypassword`,
        changform
      )
      .pipe(
        map((res: CustomResult) => {
          return res;
        }),
        catchError((err) => this.handlerError(err))
      );
  }

  //Correo
  //Enviar Correo
  EnviarCorreoConfirm(correo: string) {
    return this.http
      .put<CustomResult>(
        `${environment.apiUrl}/users/sendEmail/${correo}`,
        null
      )
      .pipe(
        map((res: CustomResult) => {
          return res;
        }),
        catchError((err) => this.handlerError(err))
      );
  }
  //Verificar Codigo
  VerificarCodigo(correo: string, codigo: string) {
    return this.http
      .get<CustomResult>(
        `${environment.apiUrl}/users/activate/${correo}/${codigo}`
      )
      .pipe(
        map((res: CustomResult) => {
          return res;
        }),
        catchError((err) => this.handlerError(err))
      );
  }

  ///Formulario
  crearFormulario(usuario?: Usuario) {
    if (usuario) {
      this._formUser.patchValue(usuario);
      return this._formUser;
    }
    return this._formUser;
  }

  //Errores
  private handlerError(err): Observable<never> {
    let status = err.status;
    let mensaje = "";
    switch (status) {
      case 400:
        mensaje = "Datos incorrectos";
        break;
      case 401:
        break;
      case 406:
        mensaje = "Verifique los datos introducidos";
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
