import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudesRepartidorPage } from './solicitudes-repartidor.page';

describe('SolicitudesRepartidorPage', () => {
  let component: SolicitudesRepartidorPage;
  let fixture: ComponentFixture<SolicitudesRepartidorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudesRepartidorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
