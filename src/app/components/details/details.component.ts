import {
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, Params, Router } from "@angular/router";
import {
  ANIMATION_ELEMENT,
  elementAnimations,
} from "@app/animations/elementAnimations";
import { Servicio } from "@app/interfaces/servicio";
import { Solicitud } from "@app/interfaces/solicitud";
import { AuthService } from "@app/services/auth.service";
import { ServicioService } from "@app/services/servicio.service";
import { SolicitudesService } from "@app/services/solicitudes.service";

import { gsap } from "gsap";
import { environment } from "src/environments/environment";
import Swal from "sweetalert2";

@Component({
  selector: "app-details",
  templateUrl: "./details.component.html",
  styleUrls: ["./details.component.scss"],
  animations: [elementAnimations],
})
export class DetailsComponent implements OnInit, AfterViewInit {
  @HostBinding("@elementAnimations")
  id: number;
  _solicitar = false;
  _rol = "CLIENT";
  servicio: Servicio = {};
  _formSolicitud: FormGroup;
  _newSolicitud: Solicitud = null;
  showSpinners = false;
  urlapi = environment.apiUrl;

  animationElement = ANIMATION_ELEMENT;
  @ViewChild("info", { static: true }) info: ElementRef<HTMLDivElement>;
  @ViewChild("back", { static: true }) back: ElementRef<HTMLDivElement>;
  @ViewChild("image", { static: true }) image: ElementRef<HTMLDivElement>;
  @ViewChild("call", { static: true }) call: ElementRef<HTMLDivElement>;

  constructor(
    public route: ActivatedRoute,
    private authSvc: AuthService,
    private router: Router,
    formbuilder: FormBuilder,
    private solic_Serv: SolicitudesService,

    private serv_Serv: ServicioService
  ) {
    this._formSolicitud = formbuilder.group({
      details: [""],
      fecha: [""],
      hours: [{ hour: 8, minute: 0 }],
    });
  }

  ngOnInit(): void {
    this._rol = this.authSvc._datos.Role;
    this.initDetailAnimations();
    this.serv_Serv.getMyServices().subscribe((res) => {
      this.route.params.subscribe((params: Params) => {
        if (params["id"]) {
          this.id = parseInt(params["id"], 10);
          this.servicio = res.find((p) => p.id === this.id);
        }
      });
    });
  }

  initDetailAnimations() {
    gsap.from(this.back.nativeElement, {
      duration: 0.5,
      opacity: 0,
      x: -10,
      delay: 0.2,
    });
    gsap.from(this.image.nativeElement, {
      duration: 0.5,
      opacity: 0,
      x: -15,
      delay: 0.4,
    });
    gsap.from(this.info.nativeElement.childNodes, {
      duration: 0.5,
      opacity: 0,
      x: -15,
      stagger: 0.2,
      delay: 0.5,
    });
    gsap.from(this.call.nativeElement, {
      duration: 0.5,
      opacity: 0,
      x: -15,
      delay: 0.7,
    });
  }

  ngAfterViewInit() {}

  goBack() {
    this.router.navigate(["/servicios"]);
  }
  cancelarSolicitud() {
    this._solicitar = false;
    this._formSolicitud.reset();
  }
  solicitarServic(value) {
    var hour = new Date();
    hour.setMonth(value.fecha.month);
    hour.setFullYear(value.fecha.year);
    hour.setDate(value.fecha.day);
    hour.setHours(value.hours.hour);
    hour.setMinutes(value.hours.minute);

    this._newSolicitud = {
      id_service: this.servicio.id,
      details: value.details,
      hour: hour,
    };

    Swal.fire({
      title: "Creando Solicitud",
      timer: 1500,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        this.solic_Serv.createSolicitud(this._newSolicitud).subscribe((res) => {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Nueva Solicitude de Servicio: " + res.service.name,
            showConfirmButton: false,
            timer: 1000,
          }).then(() => {
            this.goBack();
          });
        });
      },
    });
  }
}
