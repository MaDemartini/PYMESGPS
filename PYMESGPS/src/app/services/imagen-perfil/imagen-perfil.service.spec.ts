import { TestBed } from '@angular/core/testing';

import { ImagenPerfilService } from './imagen-perfil.service';

describe('ImagenPerfilService', () => {
  let service: ImagenPerfilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImagenPerfilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
