import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { isRepartidorGuard } from './isrepartidor.guard';

describe('isRepartidorGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => isRepartidorGuard(...guardParameters));

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
