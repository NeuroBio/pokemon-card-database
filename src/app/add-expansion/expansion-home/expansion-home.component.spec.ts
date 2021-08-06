import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { GoBackModule } from 'src/app/go-back/go-back.module';
import { AuthServiceMock } from 'src/app/_mock_services/auth.service.mock';
import { CollectionServiceMock } from 'src/app/_mock_services/collection.service.mock';
import { ExpansionServiceMock } from 'src/app/_mock_services/expansion.service.mock';
import { MessengerServiceMock } from 'src/app/_mock_services/messenger.service.mock';
import { AuthService } from 'src/app/_services/auth.service';
import { CollectionService } from 'src/app/_services/collection.service';
import { ExpansionService } from 'src/app/_services/expansion.service';
import { MessengerService } from 'src/app/_services/messenger.service';
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
        BrowserAnimationsModule,
        ReactiveFormsModule,
        RouterTestingModule,

        GoBackModule,

        MatButtonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatSelectModule
      ],
      providers: [
        FormBuilder,
        { provide: CollectionService, useClass: CollectionServiceMock },
        { provide: ExpansionService, useClass: ExpansionServiceMock },
        { provide: MessengerService, useClass: MessengerServiceMock },
        { provide: AuthService, useClass: AuthServiceMock }
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
