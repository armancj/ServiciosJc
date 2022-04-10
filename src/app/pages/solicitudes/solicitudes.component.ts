import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Solicitud } from 'src/app/interfaces/solicitud';
import { AuthService } from 'src/app/services/auth.service';
import { ServicioService } from 'src/app/services/servicio.service';
import { SolicitudesService } from 'src/app/services/solicitudes.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tables',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.scss']
})
export class SolicitudesComponent implements OnInit {
  searchText = ''
  urlapi = environment.apiUrl
  _solicitudes: Solicitud[] = []  
 
  _solicitud: Solicitud = {}
  _solicForm:FormGroup
  page_size: number = 5
  page_number:number = 1
  NumPages:number = 0
  desabilitado = true
  _horaSolicitud = ''
  constructor( private auth_Serv: AuthService, private servi_Serv: ServicioService,
     private solic_Serv: SolicitudesService,private translate: TranslateService, private formBuilder:FormBuilder) {
      this._solicForm = formBuilder.group({
        details:['']
      })
   }

  ngOnInit() {    
    this.CargarSolicitudes()
  }
  
  
  //Solicitudes
  CargarSolicitudes(){    
    this.solic_Serv.getSolicitudes().subscribe(res=>{
      this._solicitudes = <Solicitud[]>res.result
      this.NumPages = (this._solicitudes.length/this.page_size)*10     
    })
  }
  //Eliminar
  Delete(solic?: Solicitud){

  }

  //Ver
  VerSolicitud(solic: Solicitud){
    this._solicForm.patchValue({details:solic.details})
    var time: Date = new Date(solic.hour)
    var mes = time.getMonth()
    this._horaSolicitud = time.getDate() + ' de '+this.translate.instant(mes.toString())+' de '+ time.getFullYear()+', A las '+time.getHours()+':'+time.getMinutes()
    this._solicitud = solic
    this.desabilitado = false    
  }











}
