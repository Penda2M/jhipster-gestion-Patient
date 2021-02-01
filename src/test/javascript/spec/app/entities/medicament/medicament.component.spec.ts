import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { GestionPatientTestModule } from '../../../test.module';
import { MedicamentComponent } from 'app/entities/medicament/medicament.component';
import { MedicamentService } from 'app/entities/medicament/medicament.service';
import { Medicament } from 'app/shared/model/medicament.model';

describe('Component Tests', () => {
  describe('Medicament Management Component', () => {
    let comp: MedicamentComponent;
    let fixture: ComponentFixture<MedicamentComponent>;
    let service: MedicamentService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [GestionPatientTestModule],
        declarations: [MedicamentComponent],
      })
        .overrideTemplate(MedicamentComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(MedicamentComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(MedicamentService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new Medicament(123)],
            headers,
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.medicaments && comp.medicaments[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
