import { TestBed } from '@angular/core/testing';

import { SolicitudservicioService } from './solicitudservicio.service';

describe('SolicitudservicioService', () => {
  let service: SolicitudservicioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SolicitudservicioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
