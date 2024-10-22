import { TestBed } from '@angular/core/testing';

import { SolicitudRepartidorService } from './solicitud-repartidor.service';

describe('SolicitudRepartidorService', () => {
  let service: SolicitudRepartidorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SolicitudRepartidorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
