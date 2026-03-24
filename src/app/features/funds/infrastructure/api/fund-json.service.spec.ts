import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';

import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { environment } from '../../../../../environments/environment';
import { Fund } from '../../domain/models/fund.model';
import { FundJsonService } from './fund-json.service';

describe('FundJsonService', () => {
  let service: FundJsonService;
  let httpMock: HttpTestingController;

  const apiUrl = environment.apiUrl;

  const mockFunds: Fund[] = [
    {
      id: '1',
      name: 'Fondo Pensiones',
      minimumAmount: 50000,
      category: 'FPV',
      isSubscribed: false,
      amountInvested: 0,
    },
    {
      id: '2',
      name: 'Fondo Inversión',
      minimumAmount: 100000,
      category: 'FIC',
      isSubscribed: true,
      amountInvested: 200000,
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FundJsonService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(FundJsonService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get funds from API', () => {
    service.getFunds().subscribe((funds) => {
      expect(funds.length).toBe(2);
      expect(funds).toEqual(mockFunds);
    });

    const req = httpMock.expectOne(`${apiUrl}/funds`);

    expect(req.request.method).toBe('GET');

    req.flush(mockFunds);
  });

  it('should return fund by id', () => {
    service.getFundById('1').subscribe((fund) => {
      expect(fund).toEqual(mockFunds[0]);
    });

    const req = httpMock.expectOne(`${apiUrl}/funds`);

    req.flush(mockFunds);
  });

  it('should not emit when fund id does not exist', () => {
    let emitted = false;

    service.getFundById('99').subscribe(() => {
      emitted = true;
    });

    const req = httpMock.expectOne(`${apiUrl}/funds`);

    req.flush(mockFunds);

    expect(emitted).toBe(false);
  });

  it('should update subscription and return updated fund', () => {
    const amount = 75000;

    const updatedFund: Fund = {
      ...mockFunds[0],
      isSubscribed: true,
      amountInvested: amount,
    };

    const updatedFundsList: Fund[] = [updatedFund, mockFunds[1]];

    service.updateSubscription('1', true, amount).subscribe((fund) => {
      expect(fund.isSubscribed).toBe(true);

      expect(fund.amountInvested).toBe(amount);

      expect(fund.id).toBe('1');
    });

    const patchReq = httpMock.expectOne(`${apiUrl}/funds/1`);

    expect(patchReq.request.method).toBe('PATCH');

    expect(patchReq.request.body).toEqual({
      isSubscribed: true,
      amountInvested: amount,
    });

    patchReq.flush(updatedFund);

    const getReq = httpMock.expectOne(`${apiUrl}/funds`);

    expect(getReq.request.method).toBe('GET');

    getReq.flush(updatedFundsList);
  });
});
