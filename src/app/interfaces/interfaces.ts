import { stadosSolicitud } from "@app/variables/constantes";

export interface CustomResult {
    succesfully: boolean,
    result: {},
    message: string,
    count: number,
    offset: number,
    limit: number
  }

  export interface municipe{
    id?:number
    name?:string
    province?:province
  }

  export interface province{
    id?:number
    name?:string
    code?:string
  }

  export interface File{
    data:any
    progress:number
    inProgress:boolean
    idServ?: number
  }

  export interface PostRequest{
    limit: number
    offset: number
    
  }
  export interface ProvinciaMunicipios{
    provincia?:province
    municipes?: municipe[]
  }

  export interface RecoveryPass{
    email:string
    password:string
    code:number
  }

  export interface CantPorMes{
    solicitudes?:CantPerStatus
    label?:string|number
  }

  export interface CantPerStatus{
    recibida?:number
    cerrada?:number
    despachada?:number
    revisada?:number
    total?:number
  }

  export interface RequesByDate{
    date1?:string
    date2?:string
    status?:string
    technicianID?:number
    serviceID?:number
    municipeID?:number
    _mes?:string
    _nametec?:string
    _nameServ?:string
  }

  export interface ChartDS{
    data?:number[]
    label?:string
  }