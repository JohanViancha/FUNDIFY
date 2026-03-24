import { Observable } from 'rxjs';
import { Fund } from '../models/fund.model';

export abstract class FundRepository {
  abstract getFunds(): Observable<Fund[]>;
  abstract getFundById(id: string): Observable<Fund | null>;
  abstract updateSubscription(fundId: string, isSubscribed: boolean, amountInvested: number): Observable<Fund>;
}
