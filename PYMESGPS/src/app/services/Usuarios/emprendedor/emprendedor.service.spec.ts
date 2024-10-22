import { TestBed } from '@angular/core/testing';

import { EmprendedorService } from './emprendedor.service';

describe('EmprendedorService', () => {
  let service: EmprendedorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmprendedorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
