import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { GestionPatientTestModule } from '../../../test.module';
import { RendezVousDetailComponent } from 'app/entities/rendez-vous/rendez-vous-detail.component';
import { RendezVous } from 'app/shared/model/rendez-vous.model';

describe('Component Tests', () => {
  describe('RendezVous Management Detail Component', () => {
    let comp: RendezVousDetailComponent;
    let fixture: ComponentFixture<RendezVousDetailComponent>;
    const route = ({ data: of({ rendezVous: new RendezVous(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [GestionPatientTestModule],
        declarations: [RendezVousDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(RendezVousDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(RendezVousDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load rendezVous on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.rendezVous).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
