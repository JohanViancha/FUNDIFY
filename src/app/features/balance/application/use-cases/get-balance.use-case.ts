import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Balance } from '../../domain/models/balance.model';
import { BALANCE_REPOSITORY_TOKEN } from '../../domain/repositories/balance.tokens';

@Injectable({ providedIn: 'root' })
export class GetBalanceUseCase {
  private repo = inject(BALANCE_REPOSITORY_TOKEN);

  execute(): Observable<Balance> {
    return this.repo.getBalance();
  }

}
