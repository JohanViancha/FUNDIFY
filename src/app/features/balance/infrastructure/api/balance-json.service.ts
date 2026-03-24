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

  /**
   * Obtiene el balance actual desde JSON Server
   */
  getBalance() {
    return this.http.get<Balance>(`${this.apiUrl}/balance`);
  }

  /**
   * Actualiza balance con lógica de negocio local (JSON Server):
   * 1. GET balance actual
   * 2. Calcula newAvailable (+/- amount)
   * 3. Marca hasMadeFirstTransaction = true (si era false)
   * 4. PUT balance actualizado
   */
  updateBalance(amount: number, type: 'DEPOSIT' | 'WITHDRAWAL'): Observable<Balance> {
    return this.http.get<Balance>(`${this.apiUrl}/balance`).pipe(
      switchMap((currentBalance) => {
        // Calcula nuevo saldo disponible
        const newAvailable =
          type === 'DEPOSIT'
            ? currentBalance.available + amount
            : currentBalance.available - amount;

        // Marca primera transacción como completada (solo si era false)
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
