import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: "",
        redirectTo: "funds",
        pathMatch: "full"
      },
      {
        path: 'funds',
        loadChildren: () =>
          import('./features/funds/presentation/funds.routes').then((m) => m.FUNDS_ROUTES),
      },
      {
        path: 'transactions',
        loadChildren: () =>
          import('./features/transactions/presentation/transactions.routes').then(
            (m) => m.TRANSACTIONS_ROUTES,
          ),
      },
      {
        path: 'portfolio',
        loadChildren: () =>
          import('./features/portfolio/presentation/portfolio.routes').then(
            (m) => m.PORTFOLIO_ROUTES,
          ),
      }
    ]
  },
];
