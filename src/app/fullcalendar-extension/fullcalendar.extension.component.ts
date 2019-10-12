import { Component, OnInit, Input } from '@angular/core'
import { Configuration, ConfigService } from '../config.service'
declare function onFullCalendarExtensionLoad(fullCalendarExtension: FullCalendarExtensionComponent): any
@Component({
  selector: 'app-fullcalendar-extension',
  templateUrl: './fullcalendar.extension.component.html',
  styleUrls: ['./fullcalendar.extension.component.css']
})
export class FullCalendarExtensionComponent implements OnInit {
  isLoaded: boolean
  configuration: Configuration
  themeCssUri: string
  constructor(private configService: ConfigService) { }

  ngOnInit() {
    const identifier = (new URL(window.location.href)).searchParams.get('identifier')

    this.isLoaded = false
    this.configService.getConfig(identifier).subscribe(config => {

      this.configuration = config
      this.themeCssUri = 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css'
      if ('jquery-ui' === this.configuration.fullcalendar.themeSystem) {
        this.themeCssUri = `https://code.jquery.com/ui/1.12.1/themes/${this.configuration.themeName}/jquery-ui.css`
      }
      if ('bootstrap3' === this.configuration.fullcalendar.themeSystem) {
        this.themeCssUri = 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css'
        if (this.configuration.themeName) {
          this.themeCssUri = `https://bootswatch.com/3/${this.configuration.themeName}/bootstrap.min.css`
        }
      }
      if ('bootstrap4' === this.configuration.fullcalendar.themeSystem && this.configuration.themeName) {
        this.themeCssUri = `https://bootswatch.com/4/${this.configuration.themeName}/bootstrap.min.css`
      }
      this.isLoaded = true
      onFullCalendarExtensionLoad(this)
    })
  }

  initialize(fullCalendarObject) {
    if (fullCalendarObject.options.contentHeight !== 'auto') {
      console.error('MultiMonthView requires contentHeight to be "auto"')
    }
  }
  renderEvents(_fullCalendarObject, moment, _events) {
    const dayNumberSpans = document.getElementsByClassName('fc-day-number')
    let i = 0
    for (let i = 0; i < dayNumberSpans.length; i += 1) {
        const dayNumberSpan = <HTMLElement>dayNumberSpans[i]
        const tdElement = dayNumberSpan.parentElement
        tdElement.style.opacity = '1'
        const [, month, day] = (<HTMLElement>dayNumberSpan.parentNode)
          .getAttribute('data-date')
          .split('-')
          .map(s => Number(s))
        dayNumberSpan.innerHTML = `${moment.monthsShort(month - 1)} ${day}`
    }
  }
}
