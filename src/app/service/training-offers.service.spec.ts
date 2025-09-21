import { TestBed } from '@angular/core/testing';

import { TrainingOffersService } from './training-offers.service';

describe('TrainingOffersService', () => {
  let service: TrainingOffersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrainingOffersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
