import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CardPreviewModule } from 'src/app/card-preview/card-preview.module';
import { environment } from 'src/environments/environment';

import { PickCardComponent } from './pick-card.component';

describe('PickCardComponent', () => {
  let component: PickCardComponent;
  let fixture: ComponentFixture<PickCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PickCardComponent ],
      imports: [
        ReactiveFormsModule,
        AngularFireModule.initializeApp(environment.firebase),

        CardPreviewModule,

        MatButtonModule,
        MatCardModule,
        MatDialogModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatSelectModule,
        MatSnackBarModule
      ],
      providers: [
        FormBuilder,
        AngularFireAuth,
        MatDialogRef
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PickCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
