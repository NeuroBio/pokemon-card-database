import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { GoBackModule } from '../go-back/go-back.module';
import { CollectionServiceMock } from '../_mock_services/collection.service.mock';
import { CollectionService } from '../_services/collection.service';

import { SetCompletionComponent } from './set-completion.component';

describe('SetCompletionComponent', () => {
  let component: SetCompletionComponent;
  let fixture: ComponentFixture<SetCompletionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetCompletionComponent ],
      imports: [
        BrowserAnimationsModule,
        RouterTestingModule,
        ReactiveFormsModule,

        GoBackModule,

        MatFormFieldModule,
        MatIconModule,
        MatSelectModule,
        MatTooltipModule
      ],
      providers: [
        FormBuilder,
        { provide: CollectionService, useClass: CollectionServiceMock }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetCompletionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
