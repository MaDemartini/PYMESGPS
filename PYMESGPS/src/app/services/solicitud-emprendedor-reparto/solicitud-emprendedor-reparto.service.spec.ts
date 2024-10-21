import { TestBed } from '@angular/core/testing';

import { SolicitudEmprendedorRepartoService } from './solicitud-emprendedor-reparto.service';

describe('SolicitudEmprendedorRepartoService', () => {
  let service: SolicitudEmprendedorRepartoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SolicitudEmprendedorRepartoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
