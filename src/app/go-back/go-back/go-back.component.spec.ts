import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { CollectionServiceMock } from 'src/app/_mock_services/collection.service.mock';
import { CollectionService } from 'src/app/_services/collection.service';

import { GoBackComponent } from './go-back.component';

describe('GoBackComponent', () => {
  let component: GoBackComponent;
  let fixture: ComponentFixture<GoBackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoBackComponent ],
      imports: [
        RouterTestingModule,

        MatButtonModule,
        MatIconModule
      ],
      providers: [
        { provide: CollectionService, useClass: CollectionServiceMock }
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
