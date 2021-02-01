import { Moment } from 'moment';
import { IMedecin } from 'app/shared/model/medecin.model';
import { IPatient } from 'app/shared/model/patient.model';

export interface IRendezVous {
  id?: number;
  idRv?: number;
  dateRv?: Moment;
  medecin?: IMedecin;
  patient?: IPatient;
}

export class RendezVous implements IRendezVous {
  constructor(public id?: number, public idRv?: number, public dateRv?: Moment, public medecin?: IMedecin, public patient?: IPatient) {}
}
