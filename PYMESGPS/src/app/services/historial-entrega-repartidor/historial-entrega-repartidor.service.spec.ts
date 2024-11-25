import { TestBed } from '@angular/core/testing';

import { HistorialEntregaRepartidorService } from './historial-entrega-repartidor.service';

describe('HistorialEntregaRepartidorService', () => {
  let service: HistorialEntregaRepartidorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistorialEntregaRepartidorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
