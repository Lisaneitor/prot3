import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneraRutasComponent } from './genera-rutas.component';

describe('GeneraRutasComponent', () => {
  let component: GeneraRutasComponent;
  let fixture: ComponentFixture<GeneraRutasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeneraRutasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneraRutasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
