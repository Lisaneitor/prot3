import { TestBed } from '@angular/core/testing';

import { SelfEvaluationsService } from './self-evaluations.service';

describe('SelfEvaluationsService', () => {
  let service: SelfEvaluationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelfEvaluationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
