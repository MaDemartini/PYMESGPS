import { TestBed } from '@angular/core/testing';

import { EstadoEntregaService } from './estado-entrega.service';

describe('EstadoEntregaService', () => {
  let service: EstadoEntregaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstadoEntregaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
