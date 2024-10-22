import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EliminarProductosPage } from './eliminar-productos.page';

describe('EliminarProductosPage', () => {
  let component: EliminarProductosPage;
  let fixture: ComponentFixture<EliminarProductosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EliminarProductosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
