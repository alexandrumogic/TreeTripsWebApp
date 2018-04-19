import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutesSavedComponent } from './routes-saved.component';

describe('RoutesSavedComponent', () => {
  let component: RoutesSavedComponent;
  let fixture: ComponentFixture<RoutesSavedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoutesSavedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutesSavedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
