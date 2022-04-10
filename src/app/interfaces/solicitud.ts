import { Empleado } from "./empleado";
import { municipe } from "./interfaces";
import { Servicio } from "./servicio";
import { Usuario } from "./user";

export interface Solicitud {
   
    id_service?: number
    details?: string
    id?:number   
    price?: number
    status?: string
    tenchnician?: Empleado
    service?: Servicio
    municipes?: municipe
    user?: Usuario
    hour?: Date
    createdAt?:Date
    updateAt?:Date
}

export interface Estadistics{
    mes?:number
    status?:string
    count?:string
}


