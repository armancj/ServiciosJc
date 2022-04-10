import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from "@angular/router";
import { Observable } from "rxjs";
import Swal from "sweetalert2";
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private auth_Serv: AuthService, private _router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!this.auth_Serv.isLogged.isLoged) {
      if (state.url == "/servicios") {
        this._router.navigate(["/serv_init"]);
      } else {
        Swal.fire("Error!", "Debe autenticarse", "error").then(() => {
          this._router.navigate(["/login"]);
          return false;
        });
      }
    }
    return this.auth_Serv.isLogged.isLoged;
  }
}
