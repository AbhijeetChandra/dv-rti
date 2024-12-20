import { TestBed } from '@angular/core/testing';

import { StorageAPIService } from './storage-api.service';

describe('StorageAPIService', () => {
  let service: StorageAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
