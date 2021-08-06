import { TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';

import { ExpansionService } from './expansion.service';

describe('ExpansionService', () => {
  let service: ExpansionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
      ],
      providers: [
        AngularFireAuth
      ]
    });
    service = TestBed.inject(ExpansionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
