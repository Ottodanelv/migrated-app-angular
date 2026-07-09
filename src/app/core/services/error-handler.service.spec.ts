/**
 * GlobalErrorHandler Tests
 *
 * Tests for the GlobalErrorHandler which handles unhandled errors.
 * Uses Vitest with Angular testing utilities.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { GlobalErrorHandler } from './error-handler.service';

describe('GlobalErrorHandler', () => {
  let handler: GlobalErrorHandler;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'error', component: {} as any },
          { path: '**', redirectTo: 'error' },
        ]),
      ],
    });

    handler = TestBed.inject(GlobalErrorHandler);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(handler).toBeTruthy();
  });

  describe('handleError', () => {
    it('should log error to console', () => {
      const consoleSpy = vi.spyOn(console, 'error');
      const error = new Error('Test error');

      handler.handleError(error);

      expect(consoleSpy).toHaveBeenCalledWith('[GlobalErrorHandler] Unhandled error:', error);
    });

    it('should navigate to error page when not on error page', () => {
      const routerSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
      vi.spyOn(router, 'url', 'get').mockReturnValue('/info-operacion');

      handler.handleError(new Error('Test error'));

      expect(routerSpy).toHaveBeenCalledWith(['/error']);
    });

    it('should not navigate when already on error page', () => {
      const routerSpy = vi.spyOn(router, 'navigate');
      vi.spyOn(router, 'url', 'get').mockReturnValue('/error');

      handler.handleError(new Error('Test error'));

      expect(routerSpy).not.toHaveBeenCalled();
    });

    it('should handle non-Error objects', () => {
      const consoleSpy = vi.spyOn(console, 'error');

      handler.handleError('String error');

      expect(consoleSpy).toHaveBeenCalledWith('[GlobalErrorHandler] Unhandled error:', 'String error');
    });
  });
});