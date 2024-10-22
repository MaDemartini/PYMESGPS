import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestionarLotePage } from './gestionar-lote.page';

describe('GestionarLotePage', () => {
  let component: GestionarLotePage;
  let fixture: ComponentFixture<GestionarLotePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionarLotePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
