import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { ITraitement, Traitement } from 'app/shared/model/traitement.model';
import { TraitementService } from './traitement.service';
import { TraitementComponent } from './traitement.component';
import { TraitementDetailComponent } from './traitement-detail.component';
import { TraitementUpdateComponent } from './traitement-update.component';

@Injectable({ providedIn: 'root' })
export class TraitementResolve implements Resolve<ITraitement> {
  constructor(private service: TraitementService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITraitement> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((traitement: HttpResponse<Traitement>) => {
          if (traitement.body) {
            return of(traitement.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Traitement());
  }
}

export const traitementRoute: Routes = [
  {
    path: '',
    component: TraitementComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'gestionPatientApp.traitement.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TraitementDetailComponent,
    resolve: {
      traitement: TraitementResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'gestionPatientApp.traitement.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TraitementUpdateComponent,
    resolve: {
      traitement: TraitementResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'gestionPatientApp.traitement.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TraitementUpdateComponent,
    resolve: {
      traitement: TraitementResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'gestionPatientApp.traitement.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
