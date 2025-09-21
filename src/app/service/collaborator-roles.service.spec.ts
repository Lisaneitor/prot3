import { TestBed } from '@angular/core/testing';

import { CollaboratorRolesService } from './collaborator-roles.service';

describe('CollaboratorRolesService', () => {
  let service: CollaboratorRolesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CollaboratorRolesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
