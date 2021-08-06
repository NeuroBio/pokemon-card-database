import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { MessengerService } from './messenger.service';

describe('MessengerService', () => {
  let service: MessengerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MatSnackBarModule
      ]
    });
    service = TestBed.inject(MessengerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
