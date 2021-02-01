import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IOrdonnance, Ordonnance } from 'app/shared/model/ordonnance.model';
import { OrdonnanceService } from './ordonnance.service';
import { OrdonnanceComponent } from './ordonnance.component';
import { OrdonnanceDetailComponent } from './ordonnance-detail.component';
import { OrdonnanceUpdateComponent } from './ordonnance-update.component';

@Injectable({ providedIn: 'root' })
export class OrdonnanceResolve implements Resolve<IOrdonnance> {
  constructor(private service: OrdonnanceService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IOrdonnance> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((ordonnance: HttpResponse<Ordonnance>) => {
          if (ordonnance.body) {
            return of(ordonnance.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Ordonnance());
  }
}

export const ordonnanceRoute: Routes = [
  {
    path: '',
    component: OrdonnanceComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'gestionPatientApp.ordonnance.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: OrdonnanceDetailComponent,
    resolve: {
      ordonnance: OrdonnanceResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'gestionPatientApp.ordonnance.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: OrdonnanceUpdateComponent,
    resolve: {
      ordonnance: OrdonnanceResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'gestionPatientApp.ordonnance.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: OrdonnanceUpdateComponent,
    resolve: {
      ordonnance: OrdonnanceResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'gestionPatientApp.ordonnance.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
