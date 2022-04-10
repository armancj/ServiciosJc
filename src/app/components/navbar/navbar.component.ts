import { Component, OnInit, ElementRef, Input } from "@angular/core";
import { ROUTES } from "../sidebar/sidebar.component";
import {
  Location,
  LocationStrategy,
  PathLocationStrategy,
} from "@angular/common";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";

import { Usuario } from "src/app/interfaces/user";
import { environment } from "src/environments/environment";

import { Empleado } from "src/app/interfaces/empleado";
import { NotificationService } from "src/app/services/notification.service";
import { Notifications } from "src/app/interfaces/notification";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnInit {
  _isEmployee: boolean = false;
  _isLoged: boolean = false;
  contador = 0;
  public focus;
  public listTitles: any[];
  public location: Location;
  _usuarioLoged: Usuario = {};
  urlapi = environment.apiUrl;
  _notifications: Notifications[] = [];
  _ultimasNotificatios: Notifications[] = [];
  constructor(
    location: Location,
    private router: Router,
    private auth_Serv: AuthService,

    private notif_Serv: NotificationService
  ) {
    this.location = location;
  }

  ngOnInit() {
    this._isLoged = this.auth_Serv._datos.isLoged;

    this.listTitles = ROUTES.filter((listTitle) => listTitle);

    if (this._isLoged) {
      this.CargarNotificationsClient();
      this.auth_Serv.getProfile();
      this.auth_Serv._userLog$.subscribe((res) => {
        this._usuarioLoged = res;
      });
    }
  }

  logout() {
    this.auth_Serv.logout().subscribe((res) => {
      this.router.navigate(["/login"]);
    });
  }

  CargarNotificationsClient() {
    this.notif_Serv.getNotificationsClient().subscribe((res) => {
      this._notifications = res;
      this.SinLeer();
    });
  }

  NotificacionSinLeer() {
    var c = this.SinLeer();
    if (this._notifications.length > c) {
    }
  }

  LeerNotificaciones() {
    if (this._notifications.length != 0) {
      for (let i = 0; i < this._notifications.length; i++) {
        this.LeerNotificacion(Number(this._notifications[i].id));
      }
    }
  }

  SinLeer() {
    this.contador = 0;

    if (this._notifications.length != 0) {
      for (let i = 0; i < this._notifications.length; i++) {
        if (this._notifications[i].status == 2) {
          this.contador++;
        }
      }
    }

    return this.contador;
  }

  LeerNotificacion(id: number) {
    this.notif_Serv.readNotifications(id).subscribe((res) => {
      this.CargarNotificationsClient();
    });
  }

  getTitle() {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === "#") {
      titlee = titlee.slice(1);
    }

    for (var item = 0; item < this.listTitles.length; item++) {
      if (this.listTitles[item].path === titlee) {
        return this.listTitles[item].title;
      }
    }
    return "inicio";
  }
}
