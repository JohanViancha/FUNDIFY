import { inject, Injectable } from '@angular/core';
import { forkJoin, Observable, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AppError } from '../../../../shared/domain/errors/app-error';
import { Balance } from '../../../balance/domain/models/balance.model';
import { BALANCE_REPOSITORY_TOKEN } from '../../../balance/domain/repositories/balance.tokens';
import { Transaction } from '../../../transactions/domain/models/transaction.model';
import { TRANSACTION_REPOSITORY_TOKEN } from '../../../transactions/domain/repositories/transaction.tokens';
import { Fund } from '../../domain/models/fund.model';
import { FUND_REPOSITORY_TOKEN } from '../../domain/repositories/fund.tokens';

@Injectable({ providedIn: 'root' })
export class SubscribeToFundUseCase {
  private fundRepository = inject(FUND_REPOSITORY_TOKEN);
  private balanceReposotory = inject(BALANCE_REPOSITORY_TOKEN);
  private transactionRepository = inject(TRANSACTION_REPOSITORY_TOKEN);

  execute(
    fundId: string,
    amount: number,
  ): Observable<{
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

        return forkJoin({
          balance: this.balanceReposotory.getBalance(),
        }).pipe(
          switchMap(({ balance }) => {
            if (amount < fund.minimumAmount) {
              return throwError(
                () =>
                  new AppError(
                    'Monto insuficiente',
                    `El monto mínimo requerido para "${fund.name}" es <strong>$ ${fund.minimumAmount.toLocaleString('es-CO')}</strong>.<br><br>Ingresa un monto mayor o igual a este valor para continuar.`,
                  ),
              );
            }
            if (balance.available < amount) {
              return throwError(
                () =>
                  new AppError(
                    'Saldo insuficiente',
                    `Tu saldo disponible es <strong>$ ${balance.available.toLocaleString('es-CO')}</strong>, pero necesitas <strong>$ ${amount.toLocaleString('es-CO')}</strong> para esta inversión.<br><br>Deposita más fondos o elige un monto menor.`,
                  ),
              );
            }

            return forkJoin({
              transaction: this.transactionRepository.create({
                id: Date.now().toString(),
                fundId: fund.id,
                type: 'SUBSCRIPTION',
                amount,
                date: new Date(),
              }),
              balance: this.balanceReposotory.updateBalance(amount, 'WITHDRAWAL'),
              subscribedFund: this.fundRepository.updateSubscription(fundId, true, amount),
            });
          }),
        );
      }),
    );
  }
}
