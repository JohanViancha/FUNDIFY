import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { FUND_REPOSITORY_TOKEN } from './features/funds/domain/repositories/fund.tokens';
import { FundJsonService } from './features/funds/infrastructure/api/fund-json.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    { provide: FUND_REPOSITORY_TOKEN, useClass: FundJsonService }
  ]
};
