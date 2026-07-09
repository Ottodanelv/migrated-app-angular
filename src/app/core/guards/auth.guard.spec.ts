/**
 * Auth Guard Tests
 *
 * Tests for the authGuard functional route guard.
 * Uses Vitest with Angular testing utilities.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('authGuard', () => {
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });

    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should allow access when authenticated', () => {
    authService.login('test-token');

    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));

    expect(result).toBe(true);
  });

  it('should redirect to error page when not authenticated', () => {
    const routerSpy = vi.spyOn(router, 'createUrlTree');

    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));

    expect(routerSpy).toHaveBeenCalledWith(['/error']);
    expect(result).toBeDefined();
  });

  it('should return UrlTree when not authenticated', () => {
    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));

    // Result should be a UrlTree (not a boolean)
    expect(typeof result).not.toBe('boolean');
  });
});