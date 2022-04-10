import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { RecoveryPass } from "@app/interfaces/interfaces";
import { UserService } from "@app/services/user.service";

import { NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";
import Stepper from "bs-stepper";
import Swal from "sweetalert2";

@Component({
  selector: "app-changepass",
  templateUrl: "./changepass.component.html",
  styleUrls: ["./changepass.component.scss"],
  providers: [NgbTabsetConfig],
})
export class ChangepassComponent implements OnInit {
  private isValidEmail = /\S+@\S+\.\S+/;

  private stepper: Stepper;
  _changePass: RecoveryPass;
  _email: string;
  isEditable = false;
  _emailForm: FormGroup;
  _changePassForm: FormGroup;
  constructor(
    private user_Servi: UserService,
    private formBuilder: FormBuilder,
    private _router: Router
  ) {
    this._emailForm = formBuilder.group({
      email: ["", [Validators.required, Validators.pattern(this.isValidEmail)]],
    });

    this._changePassForm = formBuilder.group({
      passnew: ["", Validators.required],
      passconf: ["", Validators.required],
      codigo: ["", Validators.required],
    });
  }

  next() {
    if (this._emailForm.value) {
      this._email = this._emailForm.get("email").value;
      this.user_Servi.EnviarCorreoRecovery(this._email).subscribe((res) => {
        this.stepper.next();
      });
    }
  }

  atras() {
    this.stepper.previous();
  }

  Cambiar() {
    if (
      this._changePassForm.get("passnew").value ==
      this._changePassForm.get("passconf").value
    ) {
      this._changePass = {
        email: this._email,
        password: this._changePassForm.get("passnew").value,
        code: Number(this._changePassForm.get("codigo").value),
      };
      this.user_Servi.cambiarPass(this._changePass).subscribe((res) => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Contraseña Cambiada",
          showConfirmButton: false,
          timer: 1000,
        }).then(() => this._router.navigate(["/login"]));
      });
    } else {
      Swal.fire({
        position: "center",
        icon: "warning",
        title:
          "Datos incorrectos, Por Favor! revise los campos de contraseñas y el codigo de verificacion",
      });
    }
  }

  Cancelar() {
    this._router.navigate(["/login"]);
  }

  ngOnInit() {
    this.stepper = new Stepper(document.querySelector("#stepper1"), {
      linear: false,
      animation: true,
    });
  }
}
