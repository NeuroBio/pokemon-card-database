import { TestBed } from '@angular/core/testing';

import { ChecklistResolver } from './checklist.resolver';

describe('ChecklistResolver', () => {
  let resolver: ChecklistResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(ChecklistResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
