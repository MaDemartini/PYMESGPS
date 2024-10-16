import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudRepartidorPage } from './solicitud-repartidor.page';

describe('SolicitudRepartidorPage', () => {
  let component: SolicitudRepartidorPage;
  let fixture: ComponentFixture<SolicitudRepartidorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudRepartidorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
