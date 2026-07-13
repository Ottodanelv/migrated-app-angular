import { bootstrapApplication } from '@angular/platform-browser';
import { isCommonAssetRequest } from 'msw';

import { appConfig } from './app/app.config';
import { App } from './app/app';
import { environment } from './environments/environment';

function isMockedApiRequest(requestUrl: string): boolean {
  const resolvedApiBaseUrl = new URL(environment.apiBaseUrl, window.location.origin);
  const resolvedRequestUrl = new URL(requestUrl, window.location.origin);

  return (
    resolvedRequestUrl.origin === resolvedApiBaseUrl.origin &&
    resolvedRequestUrl.pathname.startsWith(resolvedApiBaseUrl.pathname)
  );
}

async function bootstrap(): Promise<void> {
  if (!environment.production && environment.mocks.api) {
    const { worker } = await import('./mocks/browser');

    await worker.start({
      onUnhandledRequest(request, print) {
        if (isMockedApiRequest(request.url)) {
          print.error();
          return;
        }

        if (isCommonAssetRequest(request)) {
          return;
        }
      },
    });
  }

  await bootstrapApplication(App, appConfig);
}

bootstrap().catch((err) => console.error(err));
