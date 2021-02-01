import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { GestionPatientTestModule } from '../../../test.module';
import { MedecinUpdateComponent } from 'app/entities/medecin/medecin-update.component';
import { MedecinService } from 'app/entities/medecin/medecin.service';
import { Medecin } from 'app/shared/model/medecin.model';

describe('Component Tests', () => {
  describe('Medecin Management Update Component', () => {
    let comp: MedecinUpdateComponent;
    let fixture: ComponentFixture<MedecinUpdateComponent>;
    let service: MedecinService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [GestionPatientTestModule],
        declarations: [MedecinUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(MedecinUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(MedecinUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(MedecinService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Medecin(123);
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
        const entity = new Medecin();
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
