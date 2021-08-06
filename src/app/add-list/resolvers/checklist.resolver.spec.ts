import { TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from 'src/environments/environment';

import { ChecklistResolver } from './checklist.resolver';

describe('ChecklistResolver', () => {
  let resolver: ChecklistResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        AngularFireModule.initializeApp(environment.firebase),

        MatSnackBarModule
      ],
      providers: [
        AngularFireAuth
      ]
    });
    resolver = TestBed.inject(ChecklistResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
