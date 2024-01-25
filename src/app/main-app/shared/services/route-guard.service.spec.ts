import { TestBed } from '@angular/core/testing';

import { CreatorRouteGuard } from './route-guard.service';

describe('CreatorRouteGuard', () => {
  let service: CreatorRouteGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreatorRouteGuard);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
