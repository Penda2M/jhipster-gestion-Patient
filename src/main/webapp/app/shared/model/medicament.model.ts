import { ITraitement } from 'app/shared/model/traitement.model';

export interface IMedicament {
  id?: number;
  nom?: string;
  description?: string;
  traitements?: ITraitement[];
}

export class Medicament implements IMedicament {
  constructor(public id?: number, public nom?: string, public description?: string, public traitements?: ITraitement[]) {}
}
