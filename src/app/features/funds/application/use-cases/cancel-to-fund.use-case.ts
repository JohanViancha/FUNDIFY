import { inject, Injectable } from '@angular/core';
import { forkJoin, Observable, throwError } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { BALANCE_REPOSITORY_TOKEN } from '../../../balance/domain/repositories/balance.tokens';
import { TRANSACTION_REPOSITORY_TOKEN } from '../../../transactions/domain/repositories/transaction.tokens';
import { FUND_REPOSITORY_TOKEN } from '../../domain/repositories/fund.tokens';
import { Transaction } from '../../../transactions/domain/models/transaction.model';
import { Balance } from '../../../balance/domain/models/balance.model';
import { Fund } from '../../domain/models/fund.model';
import { AppError } from '../../../../shared/domain/errors/app-error';

@Injectable({ providedIn: 'root' })
export class CancelFundUseCase {
  private fundRepository = inject(FUND_REPOSITORY_TOKEN);
  private balanceReposotory = inject(BALANCE_REPOSITORY_TOKEN);
  private transactionRepository = inject(TRANSACTION_REPOSITORY_TOKEN);

  execute(fundId: string): Observable<{
    transaction: Transaction;
    balance: Balance;
    subscribedFund: Fund;
  }> {
    return this.fundRepository.getFundById(fundId).pipe(
      switchMap((fund) => {
        if (!fund) {
          return throwError(
            () =>
              new AppError(
                'Fondo no encontrado',
                'El fondo seleccionado no existe en nuestro sistema',
              ),
          );
        }

        if (!fund.isSubscribed) {
          return throwError(
            () =>
              new AppError('No estás suscrito', `No tienes suscripción activa en "${fund.name}"`),
          );
        }

        return forkJoin({
          transaction: this.transactionRepository.create({
            id: Date.now().toString(),
            fundId: fund.id,
            type: 'CANCELLATION',
            amount: fund.amountInvested,
            date: new Date(),
          }),
          balance: this.balanceReposotory.updateBalance(fund.amountInvested, 'DEPOSIT'),
          subscribedFund: this.fundRepository.updateSubscription(fundId, false, 0),
        });
      }),
    );
  }
}
