import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { GestionPatientTestModule } from '../../../test.module';
import { RendezVousComponent } from 'app/entities/rendez-vous/rendez-vous.component';
import { RendezVousService } from 'app/entities/rendez-vous/rendez-vous.service';
import { RendezVous } from 'app/shared/model/rendez-vous.model';

describe('Component Tests', () => {
  describe('RendezVous Management Component', () => {
    let comp: RendezVousComponent;
    let fixture: ComponentFixture<RendezVousComponent>;
    let service: RendezVousService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [GestionPatientTestModule],
        declarations: [RendezVousComponent],
      })
        .overrideTemplate(RendezVousComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(RendezVousComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(RendezVousService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new RendezVous(123)],
            headers,
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.rendezVous && comp.rendezVous[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
