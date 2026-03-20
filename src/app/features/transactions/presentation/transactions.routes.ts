import { Routes } from '@angular/router';

export const TRANSACTIONS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/transactions-list/transactions-list.component').then(
        (m) => m.TransactionsListComponent
      ),
  },
];
