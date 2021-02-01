import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { GestionPatientTestModule } from '../../../test.module';
import { TraitementDetailComponent } from 'app/entities/traitement/traitement-detail.component';
import { Traitement } from 'app/shared/model/traitement.model';

describe('Component Tests', () => {
  describe('Traitement Management Detail Component', () => {
    let comp: TraitementDetailComponent;
    let fixture: ComponentFixture<TraitementDetailComponent>;
    const route = ({ data: of({ traitement: new Traitement(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [GestionPatientTestModule],
        declarations: [TraitementDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(TraitementDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(TraitementDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load traitement on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.traitement).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
