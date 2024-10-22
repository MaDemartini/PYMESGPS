import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestionarRepartidorPage } from './gestionar-repartidor.page';

describe('GestionarRepartidorPage', () => {
  let component: GestionarRepartidorPage;
  let fixture: ComponentFixture<GestionarRepartidorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionarRepartidorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
