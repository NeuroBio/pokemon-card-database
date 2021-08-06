import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { CardPreviewModule } from 'src/app/card-preview/card-preview.module';
import { GoBackModule } from 'src/app/go-back/go-back.module';
import { CardService } from 'src/app/_services/card.service';
import { CollectionService } from 'src/app/_services/collection.service';
import { MessengerService } from 'src/app/_services/messenger.service';
import { ResizeService } from 'src/app/_services/resize.service';
import { environment } from 'src/environments/environment';

import { AddCardComponent } from './add-card.component';

describe('AddCardComponent', () => {
  let component: AddCardComponent;
  let fixture: ComponentFixture<AddCardComponent>;
  const mockActiveRoute = {
    data: of({
      card: undefined
    })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ 
        AddCardComponent,
       ],
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        AngularFireModule.initializeApp(environment.firebase),
        
        CardPreviewModule,
        GoBackModule,

        MatAutocompleteModule,
        MatButtonModule,
        MatCardModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        MatSnackBarModule
      ],
      providers: [
        AngularFireAuth,
        FormBuilder,
        CardService,
        MessengerService,
        CollectionService,
        ResizeService,
        { provide: ActivatedRoute, useValue: mockActiveRoute }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
