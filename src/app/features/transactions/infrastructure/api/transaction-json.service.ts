import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Transaction } from '../../domain/models/transaction.model';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { count, map, Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TransactionJsonService implements TransactionRepository {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getTransactions() {
    return this.http.get<Transaction[]>(`${this.apiUrl}/transactions`);
  }

  create(transaction: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}/transactions`, transaction);
  }

  count(): Observable<number> {
    return this.getTransactions().pipe(map((transactions) => transactions.length));
  }
}
