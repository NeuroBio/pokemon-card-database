import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpansionViewerComponent } from './expansion-viewer.component';

describe('ExpansionViewerComponent', () => {
  let component: ExpansionViewerComponent;
  let fixture: ComponentFixture<ExpansionViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpansionViewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpansionViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
