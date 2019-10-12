import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { of, Observable } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'
import { AppSettingsService } from './app.settings.service'
const configurationPath = 'fullcalendario/configuration'
export interface Configuration {
  readonly [key: string]: any
}
interface RestResponse {
  readonly success: boolean
  readonly [key: string]: any
}
@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private baseURI: string
  constructor(private http: HttpClient, private settings: AppSettingsService) { }

  getConfig(identifier: string): Observable<Configuration> {
    return this.getBaseURI()
      .pipe(switchMap(baseURI => this.http
        .get<RestResponse>(`${baseURI}/${configurationPath}/${identifier}`)
        .pipe(map(value => {
              console.log(`RECEIVED ${value.success}`, configurationPath)
              return value.config as Configuration
          }),
          ),
        ),
      )
  }
  private getBaseURI(): Observable<string> {
    if (this.baseURI) {
      return of(this.baseURI)
    } else {
      return this.settings.getSettings()
        .pipe(map(settings => {
          this.baseURI = settings.moduleURI
          return this.baseURI
        }))
    }
  }
}
