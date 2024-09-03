import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeRepartidorPage } from './home-repartidor.page';

describe('HomeRepartidorPage', () => {
  let component: HomeRepartidorPage;
  let fixture: ComponentFixture<HomeRepartidorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeRepartidorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
