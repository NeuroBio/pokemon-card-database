import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CollectionServiceMock } from 'src/app/_mock_services/collection.service.mock';
import { CollectionService } from 'src/app/_services/collection.service';

import { IndividualCardComponent } from './individual-card.component';

describe('IndividualCardComponent', () => {
  let component: IndividualCardComponent;
  let fixture: ComponentFixture<IndividualCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndividualCardComponent ],
      imports: [
        MatButtonModule,
        MatIconModule
      ],
      providers: [
        { provide: CollectionService, useClass: CollectionServiceMock },
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
