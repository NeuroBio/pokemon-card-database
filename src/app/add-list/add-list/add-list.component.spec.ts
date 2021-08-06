import { DragDropModule } from '@angular/cdk/drag-drop';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { CardPreviewModule } from 'src/app/card-preview/card-preview.module';
import { GoBackModule } from 'src/app/go-back/go-back.module';
import { CheckListServiceMock } from 'src/app/_mock_services/check-list.service.mock';
import { CollectionServiceMock } from 'src/app/_mock_services/collection.service.mock';
import { MessengerServiceMock } from 'src/app/_mock_services/messenger.service.mock';
import { CheckListService } from 'src/app/_services/check-list.service';
import { CollectionService } from 'src/app/_services/collection.service';
import { MessengerService } from 'src/app/_services/messenger.service';

import { AddListComponent } from './add-list.component';

describe('AddListComponent', () => {
  let component: AddListComponent;
  let fixture: ComponentFixture<AddListComponent>;
  const mockActiveRoute = {
    data: of({
      checklist: undefined
    })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddListComponent ],
      imports: [
        BrowserAnimationsModule,
        RouterTestingModule,
        ReactiveFormsModule,

        CardPreviewModule,
        GoBackModule,

        MatButtonModule,
        MatCardModule,
        MatDialogModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatRadioModule,
        MatSelectModule,
        MatSlideToggleModule,
        DragDropModule
      ],
      providers: [
        FormBuilder,
        { provide: ActivatedRoute, useValue: mockActiveRoute },
        { provide: CollectionService, useClass: CollectionServiceMock },
        { provide: CheckListService, useClass: CheckListServiceMock },
        { provide: MessengerService, useClass: MessengerServiceMock },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
