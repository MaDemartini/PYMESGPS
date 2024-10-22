import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { isEmprendedorGuard } from './isemprendedor.guard';

describe('isEmprendedorGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => isEmprendedorGuard(...guardParameters));

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
