import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  public form = this.fb.group({
    email: [null, [Validators.required, Validators.email]],
    password: [null, [Validators.required]],
  });
  public errorMessage: string;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute
  ) {}

  public login() {
    this.errorMessage = null;

    this.authService.login(this.form.value).subscribe(
      () => {
        const redirectLink = this.activatedRoute.snapshot.queryParamMap.get('redirectUrl') ?? '';
        this.router.navigate([redirectLink]);
      },
      (e: Error) => (this.errorMessage = e.message)
    );
  }
}
