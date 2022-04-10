import { Empleado } from "./empleado";
import { Solicitud } from "./solicitud";
import { Usuario } from "./user";

export interface Notifications{
    id?:string
    type?: number
    status?:number
    request?: Solicitud
    client?:Usuario
    technician?:Empleado
    requestStatus?:string
}