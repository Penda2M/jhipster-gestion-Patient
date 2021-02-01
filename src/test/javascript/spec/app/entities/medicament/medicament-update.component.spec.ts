import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { GestionPatientTestModule } from '../../../test.module';
import { MedicamentUpdateComponent } from 'app/entities/medicament/medicament-update.component';
import { MedicamentService } from 'app/entities/medicament/medicament.service';
import { Medicament } from 'app/shared/model/medicament.model';

describe('Component Tests', () => {
  describe('Medicament Management Update Component', () => {
    let comp: MedicamentUpdateComponent;
    let fixture: ComponentFixture<MedicamentUpdateComponent>;
    let service: MedicamentService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [GestionPatientTestModule],
        declarations: [MedicamentUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(MedicamentUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(MedicamentUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(MedicamentService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Medicament(123);
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
        const entity = new Medicament();
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
