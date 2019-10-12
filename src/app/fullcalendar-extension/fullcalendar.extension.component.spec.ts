import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { FullCalendarExtensionComponent } from './fullcalendar.extension.component'

describe('FullCalendarExtensionComponent', () => {
  let component: FullCalendarExtensionComponent
  let fixture: ComponentFixture<FullCalendarExtensionComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FullCalendarExtensionComponent ]
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(FullCalendarExtensionComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
