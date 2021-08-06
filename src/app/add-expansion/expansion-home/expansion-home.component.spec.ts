import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { GoBackModule } from 'src/app/go-back/go-back.module';
import { CollectionServiceMock } from 'src/app/_mock_services/collection.service.mock';
import { AuthService } from 'src/app/_services/auth.service';
import { CollectionService } from 'src/app/_services/collection.service';
import { ExpansionService } from 'src/app/_services/expansion.service';
import { MessengerService } from 'src/app/_services/messenger.service';
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
        { provide: CollectionService, useClass: CollectionServiceMock },
        ExpansionService,
        MessengerService,
        FormBuilder,
        AuthService,
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
