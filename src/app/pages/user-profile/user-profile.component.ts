import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { UserEdit, Usuario } from "src/app/interfaces/user";
import { DatosService } from "src/app/services/datos.service";
import { environment } from "../../../environments/environment";
import { UserService } from "src/app/services/user.service";
import { WINDOW } from "src/app/window-token";
import { from, of } from "rxjs";
import { AuthService } from "src/app/services/auth.service";
import {
  CantPerStatus,
  File,
  municipe,
  ProvinciaMunicipios,
} from "src/app/interfaces/interfaces";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { catchError, map } from "rxjs/operators";
import { HttpErrorResponse, HttpEventType } from "@angular/common/http";
import { EmpleadosService } from "src/app/services/empleados.service";
import { Empleado } from "src/app/interfaces/empleado";
import Swal from "sweetalert2";

import { SolicitudesService } from "@app/services/solicitudes.service";
import { Solicitud } from "@app/interfaces/solicitud";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { CropperImgComponent } from "@app/components/cropper-img/cropper-img.component";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.scss"],
})
export class UserProfileComponent implements OnInit {
  file: File = {
    data: null,
    inProgress: false,
    progress: 0,
  };

  closeResult = "";
  _cantPStatus: CantPerStatus = {};
  _municipio: municipe = {};
  _municipes: municipe[] = [];
  _ProvMun: ProvinciaMunicipios[] = [];
  _formUser: FormGroup;
  desabilitado: boolean = true;
  _usuario: Usuario = { municipe: { province: {} } };
  _editUsuario: UserEdit;
  urlapi = environment.apiUrl;
  constructor(
    private user_Servi: UserService,
    private datos_Serv: DatosService,
    private auth_Serv: AuthService,
    private formBuilder: FormBuilder,
    private solic_Serv: SolicitudesService,
    private modalService: NgbModal
  ) {
    this._formUser = user_Servi.crearFormulario();
    this.CargarPerfil();
  }

  ngOnInit() {
    this.auth_Serv._userLog$.subscribe((res) => {
      this._usuario = res;
    });

    this.CargarProv();
    this.CargarSolicitudes();
  }

  CargarSolicitudes() {
    this.solic_Serv.getSolicitudes().subscribe((res) => {
      var solic = <Solicitud[]>res.result;
      let c = 0;
      let p = 0;
      let d = 0;
      let clo = 0;
      for (let i = 0; i < solic.length; i++) {
        switch (solic[i].status) {
          case "CREATED":
            c++;
            break;

          case "PROCCESING":
            p++;
            break;
          case "DISPATCHED":
            d++;
            break;
          case "CLOSED":
            clo++;
            break;
        }
      }

      this._cantPStatus = {
        cerrada: clo,
        despachada: d,
        recibida: c,
        revisada: p,
        total: solic.length,
      };
    });
  }

  CargarPerfil() {
    this.auth_Serv.getProfile().subscribe((res) => {
      this.auth_Serv._userLog$.next(res);
    });
  }

  ActivarEdit() {
    this._municipes = [];
    this.verMunicipios(this._usuario.municipe.province.id);
    this.desabilitado = false;
    this._formUser = this.user_Servi.crearFormulario(this._usuario);
  }

  Editar() {
    this._editUsuario = new UserEdit(this._formUser.value);
    this.user_Servi.editUser(this._editUsuario).subscribe((res) => {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Perfil editado correctamente",
        showConfirmButton: false,
        timer: 1000,
      }).then(() => {
        this.desabilitado = true;
        this.CargarPerfil();
      });
    });
  }

  //Enviar Correo confirmacion
  EnviarCorreo() {
    this.user_Servi
      .EnviarCorreoConfirm(this._formUser.get("email").value)
      .subscribe();
  }

  //Codigo confirmacion
  VerificarCodigo(codigo: string) {
    console.log(codigo);
    this.user_Servi
      .VerificarCodigo(this._formUser.get("email").value, codigo)
      .subscribe((res) => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Su cuenta ha sido activada correctamente",
          showConfirmButton: false,
          timer: 1000,
        }).then(() => {
          this.CargarPerfil();
        });
      });
  }

  //La imagen de perfil

  uploadFile() {
    const formData = new FormData();
    formData.append("file", this.file.data);
    this.file.inProgress = true;

    this.user_Servi
      .uploadProfileImage(formData)
      .pipe(
        map((event) => {
          switch (event.type) {
            case HttpEventType.UploadProgress:
              this.file.progress = Math.round(
                (event.loaded * 100) / event.total
              );
              break;
            case HttpEventType.Response:
              return event;
          }
        }),
        catchError((error: HttpErrorResponse) => {
          this.file.inProgress = false;
          return of("Upload failed");
        })
      )
      .subscribe((event: any) => {
        if (typeof event === "object") {
          this._formUser.patchValue({
            avatar: event.body.result.avatar,
          });
          this.CargarPerfil();
        }
      });
  }

  //Provincias
  CargarProv() {
    this._ProvMun = this.datos_Serv._Provincias;
  }

  //Municipios de la Provincia
  verMunicipios(_id: number) {
    for (let i = 0; i < this._ProvMun.length; i++) {
      if (this._ProvMun[i].provincia.id == _id) {
        this._municipes = this._ProvMun[i].municipes;
      }
    }
  }

  open(content) {
    this.modalService.open(content, { size: "lg" }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }
}
