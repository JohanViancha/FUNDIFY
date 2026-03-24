import { Observable } from 'rxjs';
import { Transaction } from '../models/transaction.model';

export abstract class TransactionRepository {

  abstract getTransactions(): Observable<Transaction[]>;
  abstract create(transaction:Transaction): Observable<Transaction>;
  abstract count(): Observable<number>

}
