import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraduccionComponent } from './traduccion.component';

describe('TraduccionComponent', () => {
  let component: TraduccionComponent;
  let fixture: ComponentFixture<TraduccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TraduccionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TraduccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
