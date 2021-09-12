import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';
import { AuthGuard } from './auth.guard';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly authGuard: AuthGuard
  ) {}

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const isAuthorized$ = this.authGuard.canActivate(route, state);
    return isAuthorized$.pipe(
      map((isAuthorized) => {
        if (!isAuthorized) {
          return this.redirect(state.url);
        }

        const res = this.authService.getSessionData()?.user?.isAdmin;
        if (!res) {
          return this.redirect(state.url);
        } else {
          return true;
        }
      }),
      catchError(() => of(this.redirect(state.url)))
    );
  }
  private redirect(url: string) {
    this.router.navigate(['login'], { queryParams: { redirectUrl: url } });
    return false;
  }
}
