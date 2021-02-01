import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { GestionPatientTestModule } from '../../../test.module';
import { AdministrateurComponent } from 'app/entities/administrateur/administrateur.component';
import { AdministrateurService } from 'app/entities/administrateur/administrateur.service';
import { Administrateur } from 'app/shared/model/administrateur.model';

describe('Component Tests', () => {
  describe('Administrateur Management Component', () => {
    let comp: AdministrateurComponent;
    let fixture: ComponentFixture<AdministrateurComponent>;
    let service: AdministrateurService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [GestionPatientTestModule],
        declarations: [AdministrateurComponent],
      })
        .overrideTemplate(AdministrateurComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AdministrateurComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(AdministrateurService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new Administrateur(123)],
            headers,
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.administrateurs && comp.administrateurs[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
