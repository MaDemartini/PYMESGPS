import { TestBed } from '@angular/core/testing';

import { HistorialEntregaService } from './historial-entrega.service';

describe('HistorialEntregaService', () => {
  let service: HistorialEntregaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistorialEntregaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
