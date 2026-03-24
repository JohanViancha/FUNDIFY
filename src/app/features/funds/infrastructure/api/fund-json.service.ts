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

   /**
   * Obtiene lista completa de fondos desde JSON Server
   */
  getFunds() {
    return this.http.get<Fund[]>(`${this.apiUrl}/funds`);
  }

  /**
   * Busca fondo por ID (cliente-side filtering).
   * Retorna null si no existe.
   */
  getFundById(id: string): Observable<Fund | null> {
    return this.getFunds().pipe(
      map((funds) => funds.find((fund) => fund.id === id)),
      filter(Boolean),
    );
  }

  /**
   * Actualiza estado suscripción de fondo:
   * - PATCH isSubscribed + amountInvested
   * - Refetch lista completa para retorno consistente
   */
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
