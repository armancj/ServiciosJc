import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Empleado } from "@app/interfaces/empleado";
import { municipe, ProvinciaMunicipios } from "@app/interfaces/interfaces";
import { Servicio } from "@app/interfaces/servicio";
import { Solicitud } from "@app/interfaces/solicitud";
import { Usuario } from "@app/interfaces/user";
import { AuthService } from "@app/services/auth.service";
import { DatosService } from "@app/services/datos.service";
import { EmpleadosService } from "@app/services/empleados.service";
import { ServicioService } from "@app/services/servicio.service";
import { SolicitudesService } from "@app/services/solicitudes.service";
import { UserService } from "@app/services/user.service";
import {
  ModalDismissReasons,
  NgbCalendar,
  NgbDateStruct,
  NgbModal,
} from "@ng-bootstrap/ng-bootstrap";
import { environment } from "src/environments/environment";
import Swal from "sweetalert2";

@Component({
  selector: "app-inicio",
  templateUrl: "./inicio.component.html",
  styleUrls: ["./inicio.component.scss"],
})
export class InicioComponent implements OnInit {
  test: Date = new Date();

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
  };
  img: string = "laptop";
  _hoy: NgbDateStruct;
  constructor(
    private serv_Servi: ServicioService,
    private formBuilder: FormBuilder,
    private userServ: UserService,
    private employServ: EmpleadosService,
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

    this.cargarServicios();
    this.CargarProv();
  }

  //Cargar todos los servicios
  cargarServicios() {
    if (this.isLoged) {
      var employe;
      var municipeid;

      this.auth_Serv.getProfile().subscribe((res) => {
        employe = <Usuario>res;

        municipeid = employe.municipe.id;
        this.buscarXMunicipio(municipeid);
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
  autenticar() {
    if (
      JSON.parse(localStorage.getItem("logtypeEmploye")) == true &&
      localStorage.getItem("logtypeEmploye")
    ) {
      this.router.navigate(["/login_employee"]);
    } else {
      this.router.navigate(["/login"]);
    }
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
