import {
  Component,
  ElementRef,
  HostBinding,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Servicio } from "src/app/interfaces/servicio";
import { Solicitud } from "src/app/interfaces/solicitud";
import { AuthService } from "src/app/services/auth.service";
import { ServicioService } from "src/app/services/servicio.service";
import { SolicitudesService } from "src/app/services/solicitudes.service";
import { environment } from "src/environments/environment";
import Swal from "sweetalert2";

import {
  NgbDate,
  NgbCalendar,
  NgbDateStruct,
  NgbModal,
  ModalDismissReasons,
} from "@ng-bootstrap/ng-bootstrap";
import { Usuario } from "@app/interfaces/user";
import { municipe, ProvinciaMunicipios } from "@app/interfaces/interfaces";
import { DatosService } from "@app/services/datos.service";

import {
  ANIMATION_ELEMENT,
  elementAnimations,
} from "@app/animations/elementAnimations";
import { UiService } from "@app/services/uiservice.service";

@Component({
  selector: "app-icons",
  templateUrl: "./servicios.component.html",
  styleUrls: ["./servicios.component.scss"],
  animations: [elementAnimations],
})
export class ServiciosComponent implements OnInit {
  @HostBinding("@elementAnimations") animate;
  animationElement = ANIMATION_ELEMENT;

  urlapi = environment.apiUrl;
  @ViewChild("close") close: ElementRef;
  _municipes: municipe[] = [];
  _ProvMun: ProvinciaMunicipios[] = [];
  buscar: boolean = false;
  hayServ = true;

  meridian = true;
  closeResult = "";
  copy: string;
  formservicio: FormGroup;
  isEmployee: boolean = false;
  _role = "";
  isLoged: boolean = false;
  _newSolicitud: Solicitud = null;
  _formSolicitud: FormGroup;
  _formMunicipe: FormGroup;
  servicios: Servicio[] = [];
  _servicio: Servicio = {
    name: "",
    description: "",
    measure: "",
    service_to: "",
    summary: "",
    price: 0,
    enterprisePrice: 0,
  };
  img: string = "laptop";
  _hoy: NgbDateStruct;
  constructor(
    private serv_Servi: ServicioService,
    formBuilder: FormBuilder,
    public ui: UiService,
    private datos_Serv: DatosService,
    private modalService: NgbModal,
    private auth_Serv: AuthService,
    private router: Router,
    private solic_Serv: SolicitudesService,
    calendar: NgbCalendar
  ) {
    this._hoy = calendar.getToday();
    this._formSolicitud = formBuilder.group({
      details: [""],
      hours: ["", Validators.required],
      fecha: ["", Validators.required],
    });

    this._formMunicipe = formBuilder.group({
      provincia: ["", Validators.required],
      municipe: ["", Validators.required],
    });
  }

  ngOnInit() {
    this.isLoged = this.auth_Serv._datos.isLoged;
    this._role = this.auth_Serv._datos.Role;
    this.cargarServicios();
    this.CargarProv();
  }

  animationDone(event) {
    (event.element as HTMLDivElement).childNodes.forEach((item) => {
      const node = item as HTMLDivElement;
      if (node.classList && node.classList.contains("active")) {
        node.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  onNavigate(item: Servicio) {
    this.router.navigate(["/details/" + item.id]);
  }

  //Cargar todos los servicios
  cargarServicios() {
    if (this.isLoged) {
      var employe;
      this.auth_Serv.getProfile().subscribe((res) => {
        employe = <Usuario>res;
        this.serv_Servi.getMyServices().subscribe((res) => {
          this.servicios = res;
        });
      });
    } else {
      this.serv_Servi.getServices().subscribe((res) => {
        this.servicios = res;
      });
    }
  }

  //Mostrar los detalles del servicio
  mostrarServicio(value: Servicio) {
    this._servicio = value;
  }

  buscarXMunicipio(municipeid: number) {
    this.serv_Servi.getServicesByMunicipes(municipeid).subscribe((res) => {
      this.servicios = res;
      if (this.servicios.length == 0) {
        this.hayServ = false;
      } else {
        this.hayServ = true;
      }
    });
  }

  buscarFormMunicipe() {
    if (this.buscar == true) {
      let idm = this._formMunicipe.get("municipe").value as number;
      this.buscarXMunicipio(idm);
      this.buscar = false;
    } else {
      this.buscar = true;
      this._formMunicipe.reset();
    }
  }

  //solicitar un servicio
  solicitarServic(value) {
    var hour = new Date();
    hour.setMonth(value.fecha.month);
    hour.setFullYear(value.fecha.year);
    hour.setDate(value.fecha.day);
    hour.setHours(value.hours.hour);
    hour.setMinutes(value.hours.minute);

    this._newSolicitud = {
      id_service: this._servicio.id,
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
            this.onClose();
          });
        });
      },
    });
  }

  irLogin() {
    this.auth_Serv._tempruta = "/servicios";
    this.router.navigateByUrl("/login");
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

  open(content) {
    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
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

  onClose() {
    this._formSolicitud.reset();
  }

  //Validar horario laboral
}
