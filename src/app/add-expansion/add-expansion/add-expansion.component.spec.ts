import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { GoBackModule } from 'src/app/go-back/go-back.module';
import { environment } from 'src/environments/environment';
import { ExpansionViewerComponent } from '../expansion-viewer/expansion-viewer.component';

import { AddExpansionComponent } from './add-expansion.component';

describe('AddExpansionComponent', () => {
  let component: AddExpansionComponent;
  let fixture: ComponentFixture<AddExpansionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AddExpansionComponent,
        ExpansionViewerComponent
      ],
      imports: [
        BrowserAnimationsModule,
        RouterTestingModule,
        ReactiveFormsModule,
        AngularFireModule.initializeApp(environment.firebase),

        GoBackModule,

        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatSnackBarModule
      ],
      providers: [
        AngularFireAuth
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddExpansionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
