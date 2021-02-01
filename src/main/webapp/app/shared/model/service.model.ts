import { IMedecin } from 'app/shared/model/medecin.model';
import { IAdministrateur } from 'app/shared/model/administrateur.model';

export interface IService {
  id?: number;
  nomservice?: string;
  medecins?: IMedecin[];
  administrateur?: IAdministrateur;
}

export class Service implements IService {
  constructor(public id?: number, public nomservice?: string, public medecins?: IMedecin[], public administrateur?: IAdministrateur) {}
}
