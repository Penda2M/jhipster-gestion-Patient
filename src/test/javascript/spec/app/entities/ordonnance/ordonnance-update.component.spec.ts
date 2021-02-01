import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { GestionPatientTestModule } from '../../../test.module';
import { OrdonnanceUpdateComponent } from 'app/entities/ordonnance/ordonnance-update.component';
import { OrdonnanceService } from 'app/entities/ordonnance/ordonnance.service';
import { Ordonnance } from 'app/shared/model/ordonnance.model';

describe('Component Tests', () => {
  describe('Ordonnance Management Update Component', () => {
    let comp: OrdonnanceUpdateComponent;
    let fixture: ComponentFixture<OrdonnanceUpdateComponent>;
    let service: OrdonnanceService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [GestionPatientTestModule],
        declarations: [OrdonnanceUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(OrdonnanceUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(OrdonnanceUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(OrdonnanceService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Ordonnance(123);
        spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.update).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));

      it('Should call create service on save for new entity', fakeAsync(() => {
        // GIVEN
        const entity = new Ordonnance();
        spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));
    });
  });
});
