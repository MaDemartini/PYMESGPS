import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudesEmprendedoresRepartoPage } from './solicitudes-emprendedores-reparto.page';

describe('SolicitudesEmprendedoresRepartoPage', () => {
  let component: SolicitudesEmprendedoresRepartoPage;
  let fixture: ComponentFixture<SolicitudesEmprendedoresRepartoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudesEmprendedoresRepartoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
