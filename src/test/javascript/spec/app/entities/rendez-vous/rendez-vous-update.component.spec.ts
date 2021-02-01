import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { GestionPatientTestModule } from '../../../test.module';
import { RendezVousUpdateComponent } from 'app/entities/rendez-vous/rendez-vous-update.component';
import { RendezVousService } from 'app/entities/rendez-vous/rendez-vous.service';
import { RendezVous } from 'app/shared/model/rendez-vous.model';

describe('Component Tests', () => {
  describe('RendezVous Management Update Component', () => {
    let comp: RendezVousUpdateComponent;
    let fixture: ComponentFixture<RendezVousUpdateComponent>;
    let service: RendezVousService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [GestionPatientTestModule],
        declarations: [RendezVousUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(RendezVousUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(RendezVousUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(RendezVousService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new RendezVous(123);
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
        const entity = new RendezVous();
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
