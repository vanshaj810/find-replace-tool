import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindReplacePanelComponent } from './find-replace-panel.component';

describe('FindReplacePanelComponent', () => {
  let component: FindReplacePanelComponent;
  let fixture: ComponentFixture<FindReplacePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindReplacePanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FindReplacePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
