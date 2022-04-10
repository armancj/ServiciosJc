import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Empleado } from "src/app/interfaces/empleado";
import { Notifications } from "src/app/interfaces/notification";
import { Usuario } from "src/app/interfaces/user";
import { AuthService } from "src/app/services/auth.service";
import { DatosService } from "src/app/services/datos.service";
import { EmpleadosService } from "src/app/services/empleados.service";
import { NotificationService } from "src/app/services/notification.service";
import { UserService } from "src/app/services/user.service";
import { environment } from "src/environments/environment";

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  { path: "/inicio", title: "Inicio", icon: "ni-tv-2 text-primary", class: "" },
  {
    path: "/servicios",
    title: "Servicios",
    icon: "ni-planet text-blue",
    class: "",
  },
  {
    path: "/solicitudes",
    title: "Mis solicitudes",
    icon: "ni-bullet-list-67 text-red",
    class: "",
  },
];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
  _isLoged: boolean = false;
  test: Date = new Date();
  _selected = "";
  _notifications: Notifications[] = [];
  public menuItems: any[];
  public isCollapsed = true;
  contador = 0;
  _usuarioLoged: any = {};
  urlapi = environment.apiUrl;
  constructor(
    private router: Router,
    private auth_Serv: AuthService,
    private notif_Serv: NotificationService
  ) {}

  ngOnInit() {
    this._isLoged = this.auth_Serv._datos.isLoged;
    this._selected = "servicio";
    if (this._isLoged) {
      this.CargarNotificationsClient();

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

  autenticar() {
    this.router.navigate(["/login"]);
  }

  irA(url: string, id: string) {
    this._selected = id;
    this.auth_Serv._tempruta = url;
    this.router.navigateByUrl(url);
  }

  CargarPerfil() {
    this.auth_Serv.getProfile().subscribe((res) => {
      this.auth_Serv._userLog$.next(res);
    });
  }

  CargarNotificationsClient() {
    this.notif_Serv.getNotificationsClient().subscribe((res) => {
      this._notifications = res;
      this.SinLeer();
    });
  }

  CargarNotificationsTech() {
    this.notif_Serv.getNotificationsTech().subscribe((res) => {
      this._notifications = res;
      this.SinLeer();
    });
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
}
