import { InjectionToken } from '@angular/core';
import { FundRepository } from './fund.repository';

export const FUND_REPOSITORY_TOKEN = new InjectionToken<FundRepository>('FundRepository');
