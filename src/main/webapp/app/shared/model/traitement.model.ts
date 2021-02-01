import { IOrdonnance } from 'app/shared/model/ordonnance.model';
import { IMedicament } from 'app/shared/model/medicament.model';

export interface ITraitement {
  id?: number;
  idTraitement?: number;
  frais?: number;
  ordonance?: IOrdonnance;
  medicament?: IMedicament;
}

export class Traitement implements ITraitement {
  constructor(
    public id?: number,
    public idTraitement?: number,
    public frais?: number,
    public ordonance?: IOrdonnance,
    public medicament?: IMedicament
  ) {}
}
