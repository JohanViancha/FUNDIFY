import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Fund } from '../../domain/models/fund.model';
import { FundRepository } from '../../domain/repositories/fund.repository';
import { filter, map, Observable, switchMap } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FundJsonService implements FundRepository {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getFunds() {
    return this.http.get<Fund[]>(`${this.apiUrl}/funds`);
  }

  getFundById(id: string): Observable<Fund | null> {
    return this.getFunds().pipe(
      map((funds) => funds.find((fund) => fund.id === id)),
      filter(Boolean),
    );
  }

  updateSubscription(
    fundId: string,
    isSubscribed: boolean,
    amountInvested: number,
  ): Observable<Fund> {
    return this.http
      .patch<Fund>(`${this.apiUrl}/funds/${fundId}`, {
        isSubscribed,
        amountInvested,
      })
      .pipe(
        switchMap(() => this.getFunds().pipe(map((funds) => funds.find((f) => f.id === fundId)!))),
      );
  }
}
