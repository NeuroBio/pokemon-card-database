import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from 'src/environments/environment';

import { GoBackComponent } from './go-back.component';

describe('GoBackComponent', () => {
  let component: GoBackComponent;
  let fixture: ComponentFixture<GoBackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoBackComponent ],
      imports: [
        RouterTestingModule,
        AngularFireModule.initializeApp(environment.firebase),

        MatButtonModule,
        MatIconModule
      ],
      providers: [
        AngularFireAuth
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GoBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
