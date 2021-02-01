import { IOrdonnance } from 'app/shared/model/ordonnance.model';
import { IRendezVous } from 'app/shared/model/rendez-vous.model';
import { IService } from 'app/shared/model/service.model';

export interface IMedecin {
  id?: number;
  matricule?: string;
  nom?: string;
  prenom?: string;
  grademedical?: string;
  telephone?: string;
  password?: string;
  ordonances?: IOrdonnance[];
  rendezvous?: IRendezVous[];
  service?: IService;
}

export class Medecin implements IMedecin {
  constructor(
    public id?: number,
    public matricule?: string,
    public nom?: string,
    public prenom?: string,
    public grademedical?: string,
    public telephone?: string,
    public password?: string,
    public ordonances?: IOrdonnance[],
    public rendezvous?: IRendezVous[],
    public service?: IService
  ) {}
}
