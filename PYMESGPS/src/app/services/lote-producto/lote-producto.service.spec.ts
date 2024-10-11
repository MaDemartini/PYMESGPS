import { TestBed } from '@angular/core/testing';

import { LoteProductoService } from './lote-producto.service';

describe('LoteProductoService', () => {
  let service: LoteProductoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoteProductoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
