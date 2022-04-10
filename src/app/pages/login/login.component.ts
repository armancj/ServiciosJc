import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Login } from "src/app/interfaces/auth";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit, OnDestroy {
  _isLoged: boolean = false;
  _fLogin: Login;
  login = true;
  _verpass = false;
  loginForm = this.formBuilder.group({
    username: ["", Validators.required],
    password: ["", Validators.required],
  });

  constructor(
    private auth_Service: AuthService,
    private _router: Router,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.auth_Service._logtypeEmployee.next(false);
    this._isLoged = this.auth_Service._datos.isLoged;
  }

  ngOnDestroy() {}

  onLogin() {
    this._fLogin = {
      username: this.loginForm.get("username").value,
      password: this.loginForm.get("password").value,
    };
    this.auth_Service.login(this._fLogin).subscribe((res) => {
      if (res) {
        this.router.navigate(["/servicios"]);
      }
    });
  }
  Register() {
    this.login = false;
  }
  RecuperarPass() {
    this.router.navigate(["/change_pass"]);
  }

  verpass() {
    this._verpass = !this._verpass;
  }

  pp() {
    window.alert("holaaa");
  }
}
