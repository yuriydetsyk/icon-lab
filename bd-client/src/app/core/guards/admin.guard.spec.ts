import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../services/auth.service';

import { AdminGuard } from './admin.guard';

describe('AdminGuard', () => {
  let guard: AdminGuard;

  beforeEach(() => {
    const authServiceStub = () => ({ getToken: () => '' });

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [AdminGuard, { provide: AuthService, useFactory: authServiceStub }],
    });
    guard = TestBed.inject(AdminGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
