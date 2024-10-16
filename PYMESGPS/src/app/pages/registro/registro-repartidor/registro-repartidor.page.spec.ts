import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroRepartidorPage } from './registro-repartidor.page';

describe('RegistroRepartidorPage', () => {
  let component: RegistroRepartidorPage;
  let fixture: ComponentFixture<RegistroRepartidorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroRepartidorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
