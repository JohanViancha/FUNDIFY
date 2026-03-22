import { InjectionToken } from '@angular/core';
import { TransactionRepository } from './transaction.repository';

export const TRANSACTION_REPOSITORY_TOKEN = new InjectionToken<TransactionRepository>(
  'TransactionRepository',
);
