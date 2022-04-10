import { Component, HostBinding, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { ANIMATION_ELEMENT } from "@app/animations/elementAnimations";
import { Login } from "@app/interfaces/auth";
import { AuthService } from "@app/services/auth.service";
import { UiService } from "@app/services/uiservice.service";
import { municipe, ProvinciaMunicipios } from "src/app/interfaces/interfaces";
import { Usuario } from "src/app/interfaces/user";
import { DatosService } from "src/app/services/datos.service";
import { UserService } from "src/app/services/user.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit {
  mensajeError = "Este campo es obligatorio";
  _typeCliente = "CLIENT";
  _typePass = true;
  _fLogin: Login;
  formUser: FormGroup;
  _municipes: municipe[] = [];
  _ProvMun: ProvinciaMunicipios[] = [];
  _newUser: Usuario = null;
  _isValid = false;
  constructor(
    private user_Servi: UserService,
    private datos_Serv: DatosService,
    public ui: UiService,
    private authServ: AuthService,
    private router: Router
  ) {
    this.formUser = this.user_Servi.crearFormulario();
    this.formUser.reset();
  }

  ngOnInit() {
    this.CargarProv();
  }

  registrarUser() {
    this._newUser = {
      fullname: this.formUser.get("fullname").value,
      password: this.formUser.get("password").value,
      email: this.formUser.get("email").value,
      address: this.formUser.get("address").value,
      phone: this.formUser.get("phone").value,
      municipeID: Number(this.formUser.get("municipe").value.id),
      ci: this.formUser.get("ci").value,
      rol:
        this.formUser.get("rol").value != null
          ? this.formUser.get("rol").value
          : this._typeCliente,
    };

    this.user_Servi.createUser(this._newUser).subscribe((res) => {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Bienvenido: " + res.username,
        showConfirmButton: false,
        timer: 2000,
      }).then(() => {
        this._fLogin = {
          username: res.username,
          password: this._newUser.password,
        };
        this.authServ.login(this._fLogin).subscribe((res) => {
          if (res) {
            this.router.navigate(["/servicios"]);
          }
        });
      });
    });
  }

  //todas las provincias
  CargarProv() {
    this._ProvMun = this.datos_Serv._Provincias;
  }

  //Muncipios por provincia
  verMunicipios(_id: number) {
    for (let i = 0; i < this._ProvMun.length; i++) {
      if (this._ProvMun[i].provincia.id == _id) {
        this._municipes = this._ProvMun[i].municipes;
      }
    }
  }
  SeleccionarType(value) {
    if (this.formUser.get("rol").value == "ENTERPRISE") {
      this._typeCliente = "ENTERPRISE";
    } else {
      this._typeCliente = "CLIENT";
    }
  }

  getErrorMessage(field: string): string {
    let message = "";
    let frase = "La contraseña es muy corta";
    if (field == "phone") {
      frase = "El numero de telefono debe ser de 8 digitos";
    }
    if (this.formUser.get(field).errors.required) {
      message = "Este campo es obligatorio";
    } else if (this.formUser.get(field).hasError("pattern")) {
      message = "El correo es invalido";
    } else if (this.formUser.get(field).hasError("minlength")) {
      message = frase;
      if (field == "ci") {
        message = "El CI debe ser de 11 digitos";
      }
    }

    return message;
  }

  isValidField(field: string) {
    console.log(field);
    if (this.formUser != null) {
      return (
        (this.formUser?.get(field).touched ||
          this.formUser?.get(field).dirty) &&
        !this.formUser?.get(field).valid
      );
    }
  }
}
