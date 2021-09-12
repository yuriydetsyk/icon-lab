import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { LoginData } from '../../models/interfaces/login-data';
import { SessionData } from '../../models/interfaces/session-data';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public get sessionDataChanged() {
    return this.sessionData$.asObservable();
  }
  public get username() {
    const sessionData = this.getSessionData();
    return sessionData ? `${sessionData.user.firstName} ${sessionData.user.lastName}` : '';
  }
  private sessionData$: BehaviorSubject<SessionData> = new BehaviorSubject<SessionData>(null);
  private COOKIE_KEY = 'bd.connect.sid';

  constructor(private readonly httpClient: HttpClient, private readonly cookieService: CookieService) {}

  public login(loginData: LoginData) {
    return this.httpClient
      .post<SessionData>(`${environment.apiUrl}/token`, loginData)
      .pipe(tap((data) => this.sessionData$.next(data)));
  }

  public logout() {
    return this.httpClient.delete<void>(`${environment.apiUrl}/token`).pipe(
      tap(() => {
        this.cookieService.delete(this.COOKIE_KEY);
        location.reload();
      })
    );
  }

  public getToken() {
    return this.cookieService.get(this.COOKIE_KEY);
  }

  public getSessionData() {
    return this.sessionData$.value;
  }

  public refreshToken() {
    return this.httpClient
      .post<SessionData>(`${environment.apiUrl}/token/refresh`, {})
      .pipe(tap((data) => this.sessionData$.next(data)));
  }

  public verifyToken() {
    return this.httpClient
      .post<SessionData>(`${environment.apiUrl}/token/verify`, {})
      .pipe(tap((data) => this.sessionData$.next(data)));
  }
}
