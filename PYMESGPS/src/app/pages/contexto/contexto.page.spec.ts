import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContextoPage } from './contexto.page';

describe('ContextoPage', () => {
  let component: ContextoPage;
  let fixture: ComponentFixture<ContextoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
