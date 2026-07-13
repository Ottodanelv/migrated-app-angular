import { bootstrapApplication } from '@angular/platform-browser';
import { isCommonAssetRequest } from 'msw';

import { appConfig } from './app/app.config';
import { App } from './app/app';
import { isMockedApiRequest } from './app/shared/utils/msw.utils';
import { environment } from './environments/environment';

async function bootstrap(): Promise<void> {
  if (!environment.production && environment.mocks.api) {
    const { worker } = await import('./mocks/browser');

    await worker.start({
      onUnhandledRequest(request, print) {
        if (
          isMockedApiRequest(
            request.url,
            environment.apiBaseUrl,
            window.location.origin,
          )
        ) {
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
