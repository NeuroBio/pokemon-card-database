import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { RouterTestingModule } from '@angular/router/testing';
import { MockPopulation } from '../_mock_objects/card-instance.mock';
import { AuthServiceMock } from '../_mock_services/auth.service.mock';
import { CollectionServiceMock } from '../_mock_services/collection.service.mock';
import { AuthService } from '../_services/auth.service';
import { CollectionService } from '../_services/collection.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ToolbarComponent } from './toolbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ToolbarComponent', () => {
  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;
  const popMock = (new MockPopulation()).mock();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolbarComponent ],
      imports: [
        BrowserAnimationsModule,
        RouterTestingModule,
        HttpClientTestingModule,

        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatSelectModule
      ],
      providers: [
        { provide: CollectionService, useClass: CollectionServiceMock },
        { provide: AuthService, useClass: AuthServiceMock }
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
