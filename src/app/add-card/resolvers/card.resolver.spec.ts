import { TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from 'src/environments/environment';

import { CardResolver } from './card.resolver';

describe('CardResolver', () => {
  let resolver: CardResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        AngularFireModule.initializeApp(environment.firebase),

        MatDialogModule,
        MatSnackBarModule
      ],
      providers: [
        AngularFireAuth,
        MatDialog
      ]
    });
    resolver = TestBed.inject(CardResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
