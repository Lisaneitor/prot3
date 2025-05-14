import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RutasActivasComponent } from './rutas-activas.component';

describe('RutasActivasComponent', () => {
  let component: RutasActivasComponent;
  let fixture: ComponentFixture<RutasActivasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RutasActivasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RutasActivasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
