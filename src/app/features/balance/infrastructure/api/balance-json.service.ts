import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Balance } from '../../domain/models/balance.model';
import { BalanceRepository } from '../../domain/repositories/balance.repository';
import { map, Observable, switchMap } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Injectable()
export class BalanceJsonService implements BalanceRepository {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getBalance() {
    return this.http.get<Balance>(`${this.apiUrl}/balance`);
  }

  updateBalance(amount: number, type: 'DEPOSIT' | 'WITHDRAWAL'): Observable<Balance> {
    return this.http.get<Balance>(`${this.apiUrl}/balance`).pipe(
      switchMap((currentBalance) => {
        const newAvailable =
          type === 'DEPOSIT'
            ? currentBalance.available + amount
            : currentBalance.available - amount;

        let isFirstTransaction = !currentBalance.hasMadeFirstTransaction
          ? true
          : currentBalance.hasMadeFirstTransaction;
        const updatedBalance: Balance = {
          ...currentBalance,
          available: newAvailable,
          hasMadeFirstTransaction: isFirstTransaction,
          lastUpdated: new Date(),
        };

        return this.http.put<Balance>(`${this.apiUrl}/balance`, updatedBalance);
      }),
    );
  }
}
