import { Routes } from '@angular/router';
import { FundListComponent } from './pages/fund-list/fund-list.component';

export const FUNDS_ROUTES: Routes = [
  {
    path: '',
    component: FundListComponent,
  },
];
