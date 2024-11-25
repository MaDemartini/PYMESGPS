import { TestBed } from '@angular/core/testing';

import { EstadoSolicitudServicioService } from './estado-solicitud-servicio.service';

describe('EstadoSolicitudServicioService', () => {
  let service: EstadoSolicitudServicioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstadoSolicitudServicioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
