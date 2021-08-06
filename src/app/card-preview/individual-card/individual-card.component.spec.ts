import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { environment } from 'src/environments/environment';

import { IndividualCardComponent } from './individual-card.component';

describe('IndividualCardComponent', () => {
  let component: IndividualCardComponent;
  let fixture: ComponentFixture<IndividualCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndividualCardComponent ],
      imports: [
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
    fixture = TestBed.createComponent(IndividualCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
