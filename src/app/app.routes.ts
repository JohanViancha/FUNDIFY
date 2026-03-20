import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'funds',
    loadChildren: () =>
      import('./features/funds/presentation/funds.routes').then((m) => m.FUNDS_ROUTES),
  },
  {
    path: 'transactions',
    loadChildren: () =>
      import('./features/transactions/presentation/transactions.routes').then((m) => m.TRANSACTIONS_ROUTES),
  },
];
