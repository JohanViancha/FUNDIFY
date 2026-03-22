import localeEsCo from '@angular/common/locales/es-CO';
import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { registerLocaleData } from '@angular/common';
import { routes } from './app.routes';
import { FUND_REPOSITORY_TOKEN } from './features/funds/domain/repositories/fund.tokens';
import { FundJsonService } from './features/funds/infrastructure/api/fund-json.service';
import { TRANSACTION_REPOSITORY_TOKEN } from './features/transactions/domain/repositories/transaction.tokens';
import { TransactionJsonService } from './features/transactions/infrastructure/api/transaction-json.service';
registerLocaleData(localeEsCo);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    { provide: LOCALE_ID, useValue: 'es-CO' },
    { provide: FUND_REPOSITORY_TOKEN, useClass: FundJsonService },
    { provide: TRANSACTION_REPOSITORY_TOKEN, useClass: TransactionJsonService },
  ],
};
