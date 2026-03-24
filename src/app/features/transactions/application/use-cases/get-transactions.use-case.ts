import { inject, Injectable } from '@angular/core';
import { TRANSACTION_REPOSITORY_TOKEN } from '../../domain/repositories/transaction.tokens';
import { FUND_REPOSITORY_TOKEN } from '../../../funds/domain/repositories/fund.tokens';
import { TransactionDto } from '../dtos/transaction.dto';
import { combineLatest, map, Observable } from 'rxjs';
import { Transaction } from '../../domain/models/transaction.model';
import { Fund } from '../../../funds/domain/models/fund.model';

@Injectable({
  providedIn: 'root',
})
export class GetTransactionsUseCase {
  private transactionRepository = inject(TRANSACTION_REPOSITORY_TOKEN);
  private fundRepository = inject(FUND_REPOSITORY_TOKEN);

  /**
   * Obtiene transacciones con nombre del fondo.
   *
   * @returns TransactionDto[] (id, fundName, type, amount, date)
   */
  execute(): Observable<TransactionDto[]> {
    // Combina fondos Y transacciones simultáneamente

    return combineLatest([
      this.fundRepository.getFunds(),
      this.transactionRepository.getTransactions(),
    ]).pipe(
      // Mapea cada transacción → DTO con fundName

      map(([funds, transactions]) =>
        transactions.map((transaction) => this.mapToDto(transaction, funds)),
      ),
    );
  }

  /**
   * Mapper privado: Transaction → TransactionDto + fundName
   * Cliente-side JOIN: busca fondo por transaction.fundId
   */
  private mapToDto(transaction: Transaction, funds: Fund[]): TransactionDto {
    const fund = funds.find((f) => f.id === transaction.fundId);
    return {
      id: transaction.id,
      fundName: fund?.name || 'Fondo no encontrado',
      type: transaction.type,
      amount: transaction.amount,
      date: transaction.date,
    };
  }
}
