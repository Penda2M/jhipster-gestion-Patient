import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { GestionPatientTestModule } from '../../../test.module';
import { TraitementComponent } from 'app/entities/traitement/traitement.component';
import { TraitementService } from 'app/entities/traitement/traitement.service';
import { Traitement } from 'app/shared/model/traitement.model';

describe('Component Tests', () => {
  describe('Traitement Management Component', () => {
    let comp: TraitementComponent;
    let fixture: ComponentFixture<TraitementComponent>;
    let service: TraitementService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [GestionPatientTestModule],
        declarations: [TraitementComponent],
      })
        .overrideTemplate(TraitementComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TraitementComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(TraitementService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new Traitement(123)],
            headers,
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.traitements && comp.traitements[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
