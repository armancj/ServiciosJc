
//Solicitudes
export enum stadosSolicitud{
    CREATED = "CREATED", 
    PROCCESING = "PROCCESING", 
    DISPATCHED = "DISPATCHED", 
    CLOSED = "CLOSED"
}

//Servicios
export enum serviceTo{
    NATURAL = "NATURAL", 
    ENTERPRISE = "ENTERPRISE", 
    BOTH = "BOTH"
}

export enum statusServi{
    AVAIBLE = "AVAIBLE" , 
    UNAVAIBLE = "UNAVAIBLE", 
    DELETED = "DELETED"
}

//Clientes
export enum clientRol{
    CLIENT = "CLIENT",
    ENTERPRISE = "ENTERPRISE"
}
export enum clientStatus{
    NO_VERIFIED="NO_VERIFIED",
    BLOCKED = "BLOCKED",
    INACTIVE = "INACTIVE",
    ACTIVE = "ACTIVE"
}

//Empleados 
export enum empleadoRol{
    TECHINICIAN = "TECHINICIAN", 
    ADMIN = "ADMIN",
    MODERATOR = "MODERATOR",     
    DIRECTIVE = "DIRECTIVE",
    AUDITOR = "AUDITOR"

}
export enum empleadoStatus{
    BLOCKED = "BLOCKED", 
    INACTIVE = "INACTIVE", 
    ACTIVE = "ACTIVE"
}
export enum empleadoLevel{
    NATIONAL = "NATIONAL",
    PROVINCIAL = "PROVINCIAL",
    MUNICIPAL = "MUNICIPAL"
}

export enum NotifyType {
    'New_REQUEST' = 1,
    'Change_Status' = 2,
    'OTHERS' = 3,
}
export enum NotifyStatus {
    'READ' = 1,
    'UNREAD' = 2,
}

export enum ServiceToEnum {
    NATURAL = 'NATURAL',
    ENTERPRISE = 'ENTERPRISE',
    BOTH = 'BOTH'
};
export enum ServiceStatus {
    AVAIBLE = 'AVAIBLE',
    UNAVAIBLE = 'UNAVAIBLE',
    DELETED = 'DELETED',

}


