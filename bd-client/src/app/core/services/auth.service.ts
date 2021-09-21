import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { BehaviorSubject, pipe } from 'rxjs';
import { map, tap } from 'rxjs/operators';

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
  private STORAGE_KEY = 'bd-connect-sid';
  private tokenPipe = pipe(
    tap(({ token }) => localStorage.setItem(this.STORAGE_KEY, token)),
    map(({ token }) => jwtDecode(token) as SessionData),
    tap((data) => this.sessionData$.next(data))
  );

  constructor(private readonly httpClient: HttpClient) { }

  public login(loginData: LoginData) {
    return this.httpClient
      .post<{ token: string }>(`${environment.apiUrl}/token`, loginData)
      .pipe(this.tokenPipe);
  }

  public logout() {
    return this.httpClient.delete<void>(`${environment.apiUrl}/token`).pipe(
      tap(() => {
        localStorage.removeItem(this.STORAGE_KEY);
        location.reload();
      })
    );
  }

  public getToken() {
    return localStorage.getItem(this.STORAGE_KEY);
  }

  public getSessionData() {
    return this.sessionData$.value;
  }

  public refreshToken() {
    return this.httpClient
      .post<{ token: string }>(`${environment.apiUrl}/token/refresh`, {})
      .pipe(this.tokenPipe);
  }

  public verifyToken() {
    return this.httpClient
      .post<{ token: string }>(`${environment.apiUrl}/token/verify`, {})
      .pipe(this.tokenPipe);
  }
}
