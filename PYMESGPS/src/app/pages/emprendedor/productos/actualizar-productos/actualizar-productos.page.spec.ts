import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActualizarProductosPage } from './actualizar-productos.page';

describe('ActualizarProductosPage', () => {
  let component: ActualizarProductosPage;
  let fixture: ComponentFixture<ActualizarProductosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ActualizarProductosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
