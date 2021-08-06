import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from 'src/environments/environment';
import { MockPopulation } from '../_mock_objects/card-instance.mock';
import { CollectionServiceMock } from '../_mock_services/collection.service.mock';
import { CollectionService } from '../_services/collection.service';

import { ToolbarComponent } from './toolbar.component';

describe('ToolbarComponent', () => {
  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;
  const popMock = (new MockPopulation()).mock();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolbarComponent ],
      imports: [
        RouterTestingModule,
        AngularFireModule.initializeApp(environment.firebase),

        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatSelectModule

      ],
      providers: [
        AngularFireAuth,
        { provide: CollectionService, useClass: CollectionServiceMock}
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarComponent);
    component = fixture.componentInstance;
    component.population = popMock;
    console.log(component.population)
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
