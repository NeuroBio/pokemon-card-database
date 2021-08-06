import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { CardPreviewModule } from 'src/app/card-preview/card-preview.module';
import { AuthServiceMock } from 'src/app/_mock_services/auth.service.mock';
import { CheckListServiceMock } from 'src/app/_mock_services/check-list.service.mock';
import { CollectionServiceMock } from 'src/app/_mock_services/collection.service.mock';
import { MessengerServiceMock } from 'src/app/_mock_services/messenger.service.mock';
import { AuthService } from 'src/app/_services/auth.service';
import { CheckListService } from 'src/app/_services/check-list.service';
import { CollectionService } from 'src/app/_services/collection.service';
import { MessengerService } from 'src/app/_services/messenger.service';
import { CardTableComponent } from '../card-table/card-table.component';

import { MainDisplayComponent } from './main-display.component';

describe('MainDisplayComponent', () => {
  let component: MainDisplayComponent;
  let fixture: ComponentFixture<MainDisplayComponent>;
  const mockActiveRoute = {
    data: of({
      checklist: {}
    }),
    snapshot: {
      paramMap: convertToParamMap({ ChecklistID: 'test' })
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ 
        MainDisplayComponent,
        CardTableComponent
       ],
      imports: [
        RouterTestingModule,
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
        { provide: CollectionService, useClass: CollectionServiceMock },
        { provide: CheckListService, useClass: CheckListServiceMock },
        { provide: AuthService, useClass: AuthServiceMock },
        { provide: MessengerService, useClass: MessengerServiceMock },
        { provide: ActivatedRoute, useValue: mockActiveRoute }
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
