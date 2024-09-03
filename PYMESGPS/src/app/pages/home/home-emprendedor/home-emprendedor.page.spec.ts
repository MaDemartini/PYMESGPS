import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeEmprendedorPage } from './home-emprendedor.page';

describe('HomeEmprendedorPage', () => {
  let component: HomeEmprendedorPage;
  let fixture: ComponentFixture<HomeEmprendedorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeEmprendedorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
