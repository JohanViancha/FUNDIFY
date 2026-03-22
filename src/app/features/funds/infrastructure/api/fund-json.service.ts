import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Fund } from '../../domain/models/fund.model';
import { FundRepository } from '../../domain/repositories/fund.repository';

@Injectable({
  providedIn: 'root',
})
export class FundJsonService implements FundRepository {
  private http = inject(HttpClient);

  getFunds() {
    return this.http.get<Fund[]>('data/funds.json');
  }
}
