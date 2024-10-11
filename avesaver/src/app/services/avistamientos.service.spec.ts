import { TestBed } from '@angular/core/testing';

import { AvistamientosService } from './avistamientos.service';

describe('AvistamientosService', () => {
  let service: AvistamientosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AvistamientosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
