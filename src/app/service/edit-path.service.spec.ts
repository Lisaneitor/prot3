import { TestBed } from '@angular/core/testing';

import { EditPathService } from './edit-path.service';

describe('EditPathService', () => {
  let service: EditPathService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditPathService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
