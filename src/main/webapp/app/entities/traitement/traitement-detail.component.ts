import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITraitement } from 'app/shared/model/traitement.model';

@Component({
  selector: 'jhi-traitement-detail',
  templateUrl: './traitement-detail.component.html',
})
export class TraitementDetailComponent implements OnInit {
  traitement: ITraitement | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ traitement }) => (this.traitement = traitement));
  }

  previousState(): void {
    window.history.back();
  }
}
