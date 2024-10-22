import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarEmprendedorPage } from './agregar-emprendedor.page';

describe('AgregarEmprendedorPage', () => {
  let component: AgregarEmprendedorPage;
  let fixture: ComponentFixture<AgregarEmprendedorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarEmprendedorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
