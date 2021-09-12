import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService, private readonly router: Router) {}

  public canActivate(_: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const sessionData = this.authService.getSessionData();
    const existingToken = this.authService.getToken();

    if (!sessionData) {
      if (!existingToken) {
        return of(false).pipe(map(() => this.redirect(state.url)));
      }

      return this.authService.verifyToken().pipe(
        map((data) => {
          if (!data) {
            return this.redirect(state.url);
          } else {
            return true;
          }
        }),
        catchError(() => of(this.redirect(state.url)))
      );
    } else {
      return of(true);
    }
  }

  private redirect(url: string) {
    this.router.navigate(['login'], { queryParams: { redirectUrl: url } });
    return false;
  }
}
