import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CardPreviewModule } from 'src/app/card-preview/card-preview.module';
import { CheckListServiceMock } from 'src/app/_mock_services/check-list.service.mock';
import { CollectionServiceMock } from 'src/app/_mock_services/collection.service.mock';
import { MessengerServiceMock } from 'src/app/_mock_services/messenger.service.mock';
import { CheckListService } from 'src/app/_services/check-list.service';
import { CollectionService } from 'src/app/_services/collection.service';
import { MessengerService } from 'src/app/_services/messenger.service';

import { PickCardComponent } from './pick-card.component';

describe('PickCardComponent', () => {
  let component: PickCardComponent;
  let fixture: ComponentFixture<PickCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PickCardComponent ],
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,

        CardPreviewModule,

        MatButtonModule,
        MatCardModule,
        MatDialogModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatSelectModule,
      ],
      providers: [
        FormBuilder,
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: { key: 'Base Set-1' } },
        { provide: MessengerService, useClass: MessengerServiceMock },
        { provide: CheckListService, useClass: CheckListServiceMock },
        { provide: CollectionService, useClass: CollectionServiceMock }
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
