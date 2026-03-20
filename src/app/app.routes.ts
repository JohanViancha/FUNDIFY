import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'funds',
    loadChildren: () =>
      import('./features/funds/presentation/funds.routes').then((m) => m.FUNDS_ROUTES),
  },
];
