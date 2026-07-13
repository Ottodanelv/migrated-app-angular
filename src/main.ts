import { bootstrapApplication } from '@angular/platform-browser';

import { appConfig } from './app/app.config';
import { App } from './app/app';
import { environment } from './environments/environment';

async function bootstrap(): Promise<void> {
  if (!environment.production && environment.mocks.api) {
    const { worker } = await import('./mocks/browser');

    await worker.start({ onUnhandledRequest: 'bypass' });
  }

  await bootstrapApplication(App, appConfig);
}

bootstrap().catch((err) => console.error(err));
