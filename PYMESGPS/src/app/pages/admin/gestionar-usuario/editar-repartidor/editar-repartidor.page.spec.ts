import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarRepartidorPage } from './editar-repartidor.page';

describe('EditarRepartidorPage', () => {
  let component: EditarRepartidorPage;
  let fixture: ComponentFixture<EditarRepartidorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarRepartidorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
