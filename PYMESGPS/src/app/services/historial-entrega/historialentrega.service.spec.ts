import { TestBed } from '@angular/core/testing';

import { HistorialentregaService } from './historialentrega.service';

describe('HistorialentregaService', () => {
  let service: HistorialentregaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistorialentregaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
