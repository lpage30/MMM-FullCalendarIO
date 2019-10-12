import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

export interface AppSettings {
    moduleURI: string
    [key: string]: any
}
@Injectable({
  providedIn: 'root',
})
export class AppSettingsService {
  constructor(private http: HttpClient) { }

  getSettings(): Observable<AppSettings> {
    return this.http.get<AppSettings>('assets/appsettings.json')
  }
}
