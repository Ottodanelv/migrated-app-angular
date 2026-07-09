/**
 * AuthService Tests
 *
 * Tests for the AuthService which manages user authentication state.
 * Uses Vitest with Angular testing utilities.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initial state', () => {
    it('should not be authenticated', () => {
      expect(service.isAuthenticated()).toBe(false);
    });

    it('should have null token', () => {
      expect(service.token()).toBeNull();
    });
  });

  describe('login', () => {
    it('should set authenticated to true', () => {
      service.login('test-token');
      expect(service.isAuthenticated()).toBe(true);
    });

    it('should set token', () => {
      service.login('test-token');
      expect(service.token()).toBe('test-token');
    });

    it('should update signal values', () => {
      // Initial state
      expect(service.isAuthenticated()).toBe(false);

      service.login('test-token');

      // After login
      expect(service.isAuthenticated()).toBe(true);
    });
  });

  describe('logout', () => {
    it('should set authenticated to false', () => {
      service.login('test-token');
      service.logout();
      expect(service.isAuthenticated()).toBe(false);
    });

    it('should clear token', () => {
      service.login('test-token');
      service.logout();
      expect(service.token()).toBeNull();
    });
  });
});