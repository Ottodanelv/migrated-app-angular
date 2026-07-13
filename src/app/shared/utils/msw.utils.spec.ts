import { describe, expect, it } from 'vitest';

import { isMockedApiRequest } from './msw.utils';

describe('isMockedApiRequest', () => {
  const origin = 'http://localhost:4200';
  const apiBaseUrl = 'http://localhost:8080/api';

  it('should match API requests under the configured base path', () => {
    expect(
      isMockedApiRequest(
        'http://localhost:8080/api/gestion-token/info-sms-generico?token=GEN-TOKEN-001',
        apiBaseUrl,
        origin,
      ),
    ).toBe(true);
  });

  it('should ignore Angular dev-server asset requests', () => {
    expect(
      isMockedApiRequest(
        'http://localhost:4200/@ng/component?c=src%2Fapp%2Fpages%2Finfo-operacion-generica%2Finfo-operacion-generica.component.ts',
        apiBaseUrl,
        origin,
      ),
    ).toBe(false);
  });

  it('should ignore same-origin application routes', () => {
    expect(
      isMockedApiRequest('http://localhost:4200/error', apiBaseUrl, origin),
    ).toBe(false);
  });
});
