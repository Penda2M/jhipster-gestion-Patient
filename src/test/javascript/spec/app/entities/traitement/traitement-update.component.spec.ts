import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { GestionPatientTestModule } from '../../../test.module';
import { TraitementUpdateComponent } from 'app/entities/traitement/traitement-update.component';
import { TraitementService } from 'app/entities/traitement/traitement.service';
import { Traitement } from 'app/shared/model/traitement.model';

describe('Component Tests', () => {
  describe('Traitement Management Update Component', () => {
    let comp: TraitementUpdateComponent;
    let fixture: ComponentFixture<TraitementUpdateComponent>;
    let service: TraitementService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [GestionPatientTestModule],
        declarations: [TraitementUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(TraitementUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TraitementUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(TraitementService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Traitement(123);
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
        const entity = new Traitement();
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
