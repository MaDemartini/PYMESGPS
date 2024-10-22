import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarEmprendedorPage } from './editar-emprendedor.page';

describe('EditarEmprendedorPage', () => {
  let component: EditarEmprendedorPage;
  let fixture: ComponentFixture<EditarEmprendedorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarEmprendedorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
