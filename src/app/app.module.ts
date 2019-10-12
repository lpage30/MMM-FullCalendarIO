import { BrowserModule } from '@angular/platform-browser'
import { HttpClientModule } from  '@angular/common/http';
import { NgModule } from '@angular/core'

import { FullCalendarExtensionComponent } from './fullcalendar-extension/fullcalendar.extension.component'

@NgModule({
  declarations: [
    FullCalendarExtensionComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [FullCalendarExtensionComponent]
})
export class AppModule { }
