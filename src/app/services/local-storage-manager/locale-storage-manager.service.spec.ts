import { TestBed } from '@angular/core/testing';

import { LocaleStorageManagerService } from './locale-storage-manager.service';

describe('LocaleStorageManagerService', () => {
  let service: LocaleStorageManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocaleStorageManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
