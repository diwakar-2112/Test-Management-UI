import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectScreen } from './project-screen';

describe('ProjectScreen', () => {
  let component: ProjectScreen;
  let fixture: ComponentFixture<ProjectScreen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectScreen]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectScreen);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
