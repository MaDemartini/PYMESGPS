import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudServicioPage } from './solicitud-servicio.page';

describe('SolicitudServicioPage', () => {
  let component: SolicitudServicioPage;
  let fixture: ComponentFixture<SolicitudServicioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudServicioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
