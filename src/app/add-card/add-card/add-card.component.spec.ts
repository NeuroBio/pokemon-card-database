import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { CardPreviewModule } from 'src/app/card-preview/card-preview.module';
import { GoBackModule } from 'src/app/go-back/go-back.module';
import { CardServiceMock } from 'src/app/_mock_services/card.service.mock';
import { CollectionServiceMock } from 'src/app/_mock_services/collection.service.mock';
import { MessengerServiceMock } from 'src/app/_mock_services/messenger.service.mock';
import { ResizeServiceMock } from 'src/app/_mock_services/resize.service.mock';
import { CardService } from 'src/app/_services/card.service';
import { CollectionService } from 'src/app/_services/collection.service';
import { MessengerService } from 'src/app/_services/messenger.service';
import { ResizeService } from 'src/app/_services/resize.service';

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
        BrowserAnimationsModule,
        RouterTestingModule,
        ReactiveFormsModule,
        
        CardPreviewModule,
        GoBackModule,

        MatAutocompleteModule,
        MatButtonModule,
        MatCardModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        MatSlideToggleModule
      ],
      providers: [
        FormBuilder,
        { provide: CardService, useClass: CardServiceMock },
        { provide: MessengerService, useClass: MessengerServiceMock },
        { provide: CollectionService, useClass: CollectionServiceMock },
        { provide: ResizeService, useClass: ResizeServiceMock },
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
