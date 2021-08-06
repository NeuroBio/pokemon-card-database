import { TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';

import { CheckListService } from './check-list.service';

describe('CheckListService', () => {
  let service: CheckListService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
      ],
      providers: [
        AngularFireAuth
      ]
    });
    service = TestBed.inject(CheckListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
