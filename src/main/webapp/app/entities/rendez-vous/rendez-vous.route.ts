import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IRendezVous, RendezVous } from 'app/shared/model/rendez-vous.model';
import { RendezVousService } from './rendez-vous.service';
import { RendezVousComponent } from './rendez-vous.component';
import { RendezVousDetailComponent } from './rendez-vous-detail.component';
import { RendezVousUpdateComponent } from './rendez-vous-update.component';

@Injectable({ providedIn: 'root' })
export class RendezVousResolve implements Resolve<IRendezVous> {
  constructor(private service: RendezVousService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IRendezVous> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((rendezVous: HttpResponse<RendezVous>) => {
          if (rendezVous.body) {
            return of(rendezVous.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new RendezVous());
  }
}

export const rendezVousRoute: Routes = [
  {
    path: '',
    component: RendezVousComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'gestionPatientApp.rendezVous.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: RendezVousDetailComponent,
    resolve: {
      rendezVous: RendezVousResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'gestionPatientApp.rendezVous.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: RendezVousUpdateComponent,
    resolve: {
      rendezVous: RendezVousResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'gestionPatientApp.rendezVous.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: RendezVousUpdateComponent,
    resolve: {
      rendezVous: RendezVousResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'gestionPatientApp.rendezVous.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
