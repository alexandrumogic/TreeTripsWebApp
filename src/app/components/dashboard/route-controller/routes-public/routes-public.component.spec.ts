import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutesPublicComponent } from './routes-public.component';

describe('RoutesPublicComponent', () => {
  let component: RoutesPublicComponent;
  let fixture: ComponentFixture<RoutesPublicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoutesPublicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutesPublicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
