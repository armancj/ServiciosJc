import { Empleado } from "./empleado";
import { Usuario } from "./user";

export interface Login{
    username:string
    password:string
}

export interface ResponseLogin{
    access_token?:string
    refresh_token?:string
    user?:Usuario|Empleado
}

export interface DatosAuth{
    Role: string,
    isLoged: boolean,
  }

export interface ResponseLogout{
    messaje?:string
}
