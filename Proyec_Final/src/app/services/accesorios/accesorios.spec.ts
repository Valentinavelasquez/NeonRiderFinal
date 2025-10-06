import { TestBed } from '@angular/core/testing';

import { Accesorios } from './accesorios';

describe('Accesorios', () => {
  let service: Accesorios;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Accesorios);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
