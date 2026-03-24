import { Observable } from 'rxjs';
import { Balance } from '../models/balance.model';

export abstract class BalanceRepository {
  abstract getBalance(): Observable<Balance>;
  abstract updateBalance(amount: number, type: 'DEPOSIT' | 'WITHDRAWAL'): Observable<Balance>;
}
