import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Transaction } from '../../domain/models/transaction.model';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';

@Injectable({
  providedIn: 'root',
})
export class TransactionJsonService implements TransactionRepository {
  private http = inject(HttpClient);

  getTransactions() {
    return this.http.get<Transaction[]>('data/transactions.json');
  }
}
