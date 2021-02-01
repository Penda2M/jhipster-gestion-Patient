import { Moment } from 'moment';
import { IOrdonnance } from 'app/shared/model/ordonnance.model';
import { IRendezVous } from 'app/shared/model/rendez-vous.model';
import { Genre } from 'app/shared/model/enumerations/genre.model';

export interface IPatient {
  id?: number;
  nomero?: number;
  nom?: string;
  prenom?: string;
  datenaissance?: Moment;
  lieunaissance?: string;
  adresse?: string;
  genre?: Genre;
  telephone?: string;
  cni?: string;
  password?: string;
  ordonances?: IOrdonnance[];
  rendezvous?: IRendezVous[];
}

export class Patient implements IPatient {
  constructor(
    public id?: number,
    public nomero?: number,
    public nom?: string,
    public prenom?: string,
    public datenaissance?: Moment,
    public lieunaissance?: string,
    public adresse?: string,
    public genre?: Genre,
    public telephone?: string,
    public cni?: string,
    public password?: string,
    public ordonances?: IOrdonnance[],
    public rendezvous?: IRendezVous[]
  ) {}
}
