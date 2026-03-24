import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { firstValueFrom } from 'rxjs';

import { environment } from '../../../../../environments/environment';
import { Balance } from '../../domain/models/balance.model';
import { BalanceJsonService } from './balance-json.service';

describe('BalanceJsonService', () => {
  let service: BalanceJsonService;
  let httpMock: HttpTestingController;

  const apiUrl = environment.apiUrl;

  const mockBalance: Balance = {
    available: 500000,
    hasMadeFirstTransaction: false,
    lastUpdated: new Date(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BalanceJsonService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(BalanceJsonService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get balance', async () => {
    const promise = firstValueFrom(service.getBalance());

    const req = httpMock.expectOne(`${apiUrl}/balance`);

    expect(req.request.method).toBe('GET');

    req.flush(mockBalance);

    const result = await promise;

    expect(result).toEqual(mockBalance);
  });

  it('should update balance with DEPOSIT', async () => {
    const amount = 100000;

    const promise = firstValueFrom(service.updateBalance(amount, 'DEPOSIT'));

    const getReq = httpMock.expectOne(`${apiUrl}/balance`);

    expect(getReq.request.method).toBe('GET');

    getReq.flush(mockBalance);

    const putReq = httpMock.expectOne(`${apiUrl}/balance`);

    expect(putReq.request.method).toBe('PUT');

    const updatedBalance = putReq.request.body;

    expect(updatedBalance.available).toBe(mockBalance.available + amount);

    expect(updatedBalance.hasMadeFirstTransaction).toBe(true);

    putReq.flush(updatedBalance);

    const result = await promise;

    expect(result.available).toBe(mockBalance.available + amount);
  });

  it('should update balance with WITHDRAWAL', async () => {
    const amount = 50000;

    const promise = firstValueFrom(service.updateBalance(amount, 'WITHDRAWAL'));

    const getReq = httpMock.expectOne(`${apiUrl}/balance`);

    getReq.flush({
      ...mockBalance,
      hasMadeFirstTransaction: true,
    });

    const putReq = httpMock.expectOne(`${apiUrl}/balance`);

    const updatedBalance = putReq.request.body;

    expect(updatedBalance.available).toBe(mockBalance.available - amount);

    expect(updatedBalance.hasMadeFirstTransaction).toBe(true);

    putReq.flush(updatedBalance);

    const result = await promise;

    expect(result.available).toBe(mockBalance.available - amount);
  });

  it('should update lastUpdated date', async () => {
    const promise = firstValueFrom(service.updateBalance(10000, 'DEPOSIT'));

    const getReq = httpMock.expectOne(`${apiUrl}/balance`);

    getReq.flush(mockBalance);

    const putReq = httpMock.expectOne(`${apiUrl}/balance`);

    const updatedBalance = putReq.request.body;

    expect(updatedBalance.lastUpdated).toBeDefined();

    putReq.flush(updatedBalance);

    await promise;
  });
});
