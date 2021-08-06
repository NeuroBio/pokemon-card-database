import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { GoBackModule } from 'src/app/go-back/go-back.module';
import { convertToParamMap } from '@angular/router';

import { BinderViewComponent } from './binder-view.component';
import { CollectionService } from 'src/app/_services/collection.service';
import { CollectionServiceMock } from 'src/app/_mock_services/collection.service.mock';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('BinderViewComponent', () => {
  let component: BinderViewComponent;
  let fixture: ComponentFixture<BinderViewComponent>;
  const mockActiveRoute = {
    snapshot: {
      paramMap: convertToParamMap({ ChecklistID: 'test' })
    }
  }
 
  

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BinderViewComponent ],
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,

        GoBackModule,

        MatButtonModule,
        MatDividerModule,
        MatFormFieldModule,
        MatGridListModule,
        MatIconModule,
        MatInputModule,
        MatRadioModule
      ],
      providers: [
        FormBuilder,
        { provide: ActivatedRoute, useValue: mockActiveRoute },
        { provide: CollectionService, useClass: CollectionServiceMock }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BinderViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
