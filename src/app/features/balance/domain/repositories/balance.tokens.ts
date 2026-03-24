import { InjectionToken } from '@angular/core';
import { BalanceRepository } from './balance.repository';

export const BALANCE_REPOSITORY_TOKEN = new InjectionToken<BalanceRepository>('BalanceRepository');
