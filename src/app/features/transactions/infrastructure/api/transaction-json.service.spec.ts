import { beforeEach, describe, expect, it } from 'vitest';

import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';

import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { environment } from '../../../../../environments/environment';
import { Transaction } from '../../domain/models/transaction.model';
import { TransactionJsonService } from './transaction-json.service';

describe('TransactionJsonService', () => {
  let service: TransactionJsonService;
  let httpMock: HttpTestingController;

  const apiUrl = environment.apiUrl;

  const mockTransactions: Transaction[] = [
    {
      id: 't1',
      fundId: '1',
      type: 'SUBSCRIPTION',
      amount: 100000,
      date: new Date('2024-01-01'),
    },
    {
      id: 't2',
      fundId: '2',
      type: 'CANCELLATION',
      amount: 50000,
      date: new Date('2024-02-01'),
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TransactionJsonService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(TransactionJsonService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get transactions from API', () => {
    service.getTransactions().subscribe((transactions) => {
      expect(transactions.length).toBe(2);
      expect(transactions).toEqual(mockTransactions);
    });

    const req = httpMock.expectOne(`${apiUrl}/transactions`);

    expect(req.request.method).toBe('GET');

    req.flush(mockTransactions);
  });

  it('should create a transaction using POST', () => {
    const newTransaction: Transaction = {
      id: 't3',
      fundId: '1',
      type: 'SUBSCRIPTION',
      amount: 75000,
      date: new Date('2024-03-01'),
    };

    service.create(newTransaction).subscribe((transaction) => {
      expect(transaction).toEqual(newTransaction);
    });

    const req = httpMock.expectOne(`${apiUrl}/transactions`);

    expect(req.request.method).toBe('POST');

    expect(req.request.body).toEqual(newTransaction);

    req.flush(newTransaction);
  });
});
