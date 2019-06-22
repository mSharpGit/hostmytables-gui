import { TestBed } from '@angular/core/testing';

import { FloorsService } from './floors.service';

describe('FloorsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FloorsService = TestBed.get(FloorsService);
    expect(service).toBeTruthy();
  });
});
