import { TestBed } from '@angular/core/testing';

import { CardResolver } from './card.resolver';

describe('CardResolver', () => {
  let resolver: CardResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(CardResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
