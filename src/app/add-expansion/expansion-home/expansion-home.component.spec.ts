import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { GoBackModule } from 'src/app/go-back/go-back.module';
import { environment } from 'src/environments/environment';
import { ExpansionViewerComponent } from '../expansion-viewer/expansion-viewer.component';

import { ExpansionHomeComponent } from './expansion-home.component';

describe('ExpansionHomeComponent', () => {
  let component: ExpansionHomeComponent;
  let fixture: ComponentFixture<ExpansionHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ 
        ExpansionHomeComponent,
        ExpansionViewerComponent
      ],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        AngularFireModule.initializeApp(environment.firebase),

        GoBackModule,

        MatButtonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatSelectModule,
        MatSnackBarModule
      ],
      providers: [
        AngularFireAuth,
        MatDialog
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpansionHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
