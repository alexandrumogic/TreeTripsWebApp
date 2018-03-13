import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteControllerComponent } from './route-controller.component';

describe('RouteControllerComponent', () => {
  let component: RouteControllerComponent;
  let fixture: ComponentFixture<RouteControllerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RouteControllerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
