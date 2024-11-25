import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LotesCreadosPage } from './lotes-creados.page';

describe('LotesCreadosPage', () => {
  let component: LotesCreadosPage;
  let fixture: ComponentFixture<LotesCreadosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LotesCreadosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
