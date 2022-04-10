import { municipe } from "./interfaces";

export interface Usuario {
  username?: string;
  fullname?: string;
  email?: string;
  password?: string;
  phone?: string;
  address?: string;
  municipeID?: number;
  id?: number;
  rol?: string;
  status?: string;
  avatar?: string;
  municipe?: municipe;
  activateCode?: number;
  createdAt?: Date;
  updateAt?: Date;
  ci?: string;
}

export class UserEdit {
  fullname?: string;
  phone?: string;
  address?: string;
  municipe?: municipe;
  email?: string;
  constructor(any: any) {
    this.fullname = any.fullname;
    this.phone = any.phone;
    this.address = any.address;
    this.municipe = any.municipe;
    this.email = any.email;
  }
}
