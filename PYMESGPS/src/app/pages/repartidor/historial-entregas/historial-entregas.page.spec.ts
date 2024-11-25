import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistorialEntregasPage } from './historial-entregas.page';

describe('HistorialEntregasPage', () => {
  let component: HistorialEntregasPage;
  let fixture: ComponentFixture<HistorialEntregasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialEntregasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
