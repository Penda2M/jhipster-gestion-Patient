import { IService } from 'app/shared/model/service.model';

export interface IAdministrateur {
  id?: number;
  nom?: string;
  prenom?: string;
  email?: string;
  password?: string;
  services?: IService[];
}

export class Administrateur implements IAdministrateur {
  constructor(
    public id?: number,
    public nom?: string,
    public prenom?: string,
    public email?: string,
    public password?: string,
    public services?: IService[]
  ) {}
}
