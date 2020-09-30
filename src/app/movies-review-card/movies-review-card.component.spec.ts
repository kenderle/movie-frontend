import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoviesReviewCardComponent } from './movies-review-card.component';

describe('MoviesReviewCardComponent', () => {
  let component: MoviesReviewCardComponent;
  let fixture: ComponentFixture<MoviesReviewCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoviesReviewCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoviesReviewCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
