import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IMedecin, Medecin } from 'app/shared/model/medecin.model';
import { MedecinService } from './medecin.service';
import { MedecinComponent } from './medecin.component';
import { MedecinDetailComponent } from './medecin-detail.component';
import { MedecinUpdateComponent } from './medecin-update.component';

@Injectable({ providedIn: 'root' })
export class MedecinResolve implements Resolve<IMedecin> {
  constructor(private service: MedecinService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMedecin> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((medecin: HttpResponse<Medecin>) => {
          if (medecin.body) {
            return of(medecin.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Medecin());
  }
}

export const medecinRoute: Routes = [
  {
    path: '',
    component: MedecinComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'gestionPatientApp.medecin.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MedecinDetailComponent,
    resolve: {
      medecin: MedecinResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'gestionPatientApp.medecin.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MedecinUpdateComponent,
    resolve: {
      medecin: MedecinResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'gestionPatientApp.medecin.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MedecinUpdateComponent,
    resolve: {
      medecin: MedecinResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'gestionPatientApp.medecin.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
