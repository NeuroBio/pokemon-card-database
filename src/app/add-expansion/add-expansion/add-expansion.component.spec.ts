import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { GoBackModule } from 'src/app/go-back/go-back.module';
import { CollectionServiceMock } from 'src/app/_mock_services/collection.service.mock';
import { ExpansionServiceMock } from 'src/app/_mock_services/expansion.service.mock';
import { MessengerServiceMock } from 'src/app/_mock_services/messenger.service.mock';
import { CollectionService } from 'src/app/_services/collection.service';
import { ExpansionService } from 'src/app/_services/expansion.service';
import { MessengerService } from 'src/app/_services/messenger.service';
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
        GoBackModule,

        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressSpinnerModule,
      ],
      providers: [
        FormBuilder,
        { provide: ExpansionService, useClass: ExpansionServiceMock },
        { provide: MessengerService, useClass: MessengerServiceMock },
        { provide: CollectionService, useClass: CollectionServiceMock }
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
