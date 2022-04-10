import { municipe } from "./interfaces";

export interface Servicio {
  id?: number;
  measure?: string;
  name?: string;
  summary?: string;
  description?: string;
  price?: number;
  enterprisePrice?: number;
  picture?: string;
  service_to?: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
  municipe?: municipe;
}
