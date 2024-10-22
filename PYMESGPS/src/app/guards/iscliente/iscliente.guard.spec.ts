import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { isClienteGuard } from './iscliente.guard';


describe('isclienteGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => isClienteGuard(...guardParameters));

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
