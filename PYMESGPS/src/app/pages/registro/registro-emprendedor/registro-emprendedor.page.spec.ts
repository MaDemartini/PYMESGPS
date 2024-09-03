import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroEmprendedorPage } from './registro-emprendedor.page';

describe('RegistroEmprendedorPage', () => {
  let component: RegistroEmprendedorPage;
  let fixture: ComponentFixture<RegistroEmprendedorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroEmprendedorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
