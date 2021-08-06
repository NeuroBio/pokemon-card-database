import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
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
import { environment } from 'src/environments/environment';

import { BinderViewComponent } from './binder-view.component';

describe('BinderViewComponent', () => {
  let component: BinderViewComponent;
  let fixture: ComponentFixture<BinderViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BinderViewComponent ],
      imports: [
        RouterTestingModule,
        AngularFireModule.initializeApp(environment.firebase),

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
        ActivatedRoute,
        AngularFireAuth
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
