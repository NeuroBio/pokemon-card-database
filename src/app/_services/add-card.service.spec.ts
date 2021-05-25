import { TestBed } from '@angular/core/testing';

import { AddCardService } from './add-card.service';

describe('AddCardService', () => {
  let service: AddCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddCardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
