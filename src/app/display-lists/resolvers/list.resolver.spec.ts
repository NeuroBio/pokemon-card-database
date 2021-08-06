import { TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from 'src/environments/environment';

import { ListResolver } from './list.resolver';

describe('ListResolver', () => {
  let resolver: ListResolver;

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
    resolver = TestBed.inject(ListResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
