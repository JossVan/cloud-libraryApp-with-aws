import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraerComponent } from './extraer.component';

describe('ExtraerComponent', () => {
  let component: ExtraerComponent;
  let fixture: ComponentFixture<ExtraerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtraerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtraerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
