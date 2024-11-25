import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleLotePage } from './detalle-lote.page';

describe('DetalleLotePage', () => {
  let component: DetalleLotePage;
  let fixture: ComponentFixture<DetalleLotePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleLotePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
