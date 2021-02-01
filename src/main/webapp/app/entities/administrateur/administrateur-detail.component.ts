import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAdministrateur } from 'app/shared/model/administrateur.model';

@Component({
  selector: 'jhi-administrateur-detail',
  templateUrl: './administrateur-detail.component.html',
})
export class AdministrateurDetailComponent implements OnInit {
  administrateur: IAdministrateur | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ administrateur }) => (this.administrateur = administrateur));
  }

  previousState(): void {
    window.history.back();
  }
}
