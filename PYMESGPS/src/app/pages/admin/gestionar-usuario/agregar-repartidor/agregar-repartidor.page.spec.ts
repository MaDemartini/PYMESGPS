import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarRepartidorPage } from './agregar-repartidor.page';

describe('AgregarRepartidorPage', () => {
  let component: AgregarRepartidorPage;
  let fixture: ComponentFixture<AgregarRepartidorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarRepartidorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
