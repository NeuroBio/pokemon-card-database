import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { CardPreviewModule } from 'src/app/card-preview/card-preview.module';
import { environment } from 'src/environments/environment';
import { CardTableComponent } from '../card-table/card-table.component';

import { MainDisplayComponent } from './main-display.component';

describe('MainDisplayComponent', () => {
  let component: MainDisplayComponent;
  let fixture: ComponentFixture<MainDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ 
        MainDisplayComponent,
        CardTableComponent
       ],
      imports: [
        RouterTestingModule,
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
        MatSnackBarModule,
      ],
      providers: [
        FormBuilder,
        AngularFireAuth,
        MatDialog
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
