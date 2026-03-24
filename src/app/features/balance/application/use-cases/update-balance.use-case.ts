import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Balance } from '../../domain/models/balance.model';
import { BALANCE_REPOSITORY_TOKEN } from '../../domain/repositories/balance.tokens';

@Injectable({ providedIn: 'root' })
export class UpdateBalanceUseCase {
  private repo = inject(BALANCE_REPOSITORY_TOKEN);

  execute(amount: number, type: 'DEPOSIT' | 'WITHDRAWAL'): Observable<Balance> {
    return this.repo.updateBalance(amount, type);
  }
}
