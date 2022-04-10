import { municipe } from "./interfaces";

export interface Empleado {
  id?:number
  ci?:string
  pendingRequestcount?:number
  status?:string
  avatar?:string
  municipe?:municipe
  createdAt?:Date
  updateAt?:Date
  rol?: string,
  level?: number,
  username?: string,
  fullname?: string,
  email?: string,
  phone?: string,
  address?: string,
  password?: string,
  municipeID?: number,
  services?: number[],
  jefeGrupo?:number
}

