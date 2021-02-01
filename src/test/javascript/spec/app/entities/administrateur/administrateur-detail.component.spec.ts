import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { GestionPatientTestModule } from '../../../test.module';
import { AdministrateurDetailComponent } from 'app/entities/administrateur/administrateur-detail.component';
import { Administrateur } from 'app/shared/model/administrateur.model';

describe('Component Tests', () => {
  describe('Administrateur Management Detail Component', () => {
    let comp: AdministrateurDetailComponent;
    let fixture: ComponentFixture<AdministrateurDetailComponent>;
    const route = ({ data: of({ administrateur: new Administrateur(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [GestionPatientTestModule],
        declarations: [AdministrateurDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(AdministrateurDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(AdministrateurDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load administrateur on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.administrateur).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
