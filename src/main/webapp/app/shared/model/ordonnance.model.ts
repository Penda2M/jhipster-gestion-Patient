import { Moment } from 'moment';
import { ITraitement } from 'app/shared/model/traitement.model';
import { IMedecin } from 'app/shared/model/medecin.model';
import { IPatient } from 'app/shared/model/patient.model';

export interface IOrdonnance {
  id?: number;
  date?: Moment;
  traitements?: ITraitement[];
  medecin?: IMedecin;
  patient?: IPatient;
}

export class Ordonnance implements IOrdonnance {
  constructor(
    public id?: number,
    public date?: Moment,
    public traitements?: ITraitement[],
    public medecin?: IMedecin,
    public patient?: IPatient
  ) {}
}
