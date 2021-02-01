import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { GestionPatientTestModule } from '../../../test.module';
import { MedicamentDetailComponent } from 'app/entities/medicament/medicament-detail.component';
import { Medicament } from 'app/shared/model/medicament.model';

describe('Component Tests', () => {
  describe('Medicament Management Detail Component', () => {
    let comp: MedicamentDetailComponent;
    let fixture: ComponentFixture<MedicamentDetailComponent>;
    const route = ({ data: of({ medicament: new Medicament(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [GestionPatientTestModule],
        declarations: [MedicamentDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(MedicamentDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(MedicamentDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load medicament on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.medicament).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
