import { TestBed } from '@angular/core/testing';

import { EstadoentregaService } from './estadoentrega.service';

describe('EstadoentregaService', () => {
  let service: EstadoentregaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstadoentregaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
