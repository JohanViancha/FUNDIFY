import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { GetTransactionsUseCase } from './get-transactions.use-case';

import { TRANSACTION_REPOSITORY_TOKEN } from '../../domain/repositories/transaction.tokens';

import { FUND_REPOSITORY_TOKEN } from '../../../funds/domain/repositories/fund.tokens';

import { Transaction } from '../../domain/models/transaction.model';
import { Fund } from '../../../funds/domain/models/fund.model';

describe('GetTransactionsUseCase', () => {
  let useCase: GetTransactionsUseCase;

  let mockTransactionRepository: any;
  let mockFundRepository: any;

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
      amountInvested: 0,
    },
  ];

  const mockTransactions: Transaction[] = [
    {
      id: 'tx1',
      fundId: '1',
      type: 'SUBSCRIPTION',
      amount: 50000,
      date: new Date('2026-01-01'),
    },
    {
      id: 'tx2',
      fundId: '2',
      type: 'CANCELLATION',
      amount: 100000,
      date: new Date('2026-01-02'),
    },
  ];

  beforeEach(() => {
    mockTransactionRepository = {
      getTransactions: vi.fn(),
    };

    mockFundRepository = {
      getFunds: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        GetTransactionsUseCase,
        {
          provide: TRANSACTION_REPOSITORY_TOKEN,
          useValue: mockTransactionRepository,
        },
        {
          provide: FUND_REPOSITORY_TOKEN,
          useValue: mockFundRepository,
        },
      ],
    });

    useCase = TestBed.inject(GetTransactionsUseCase);
  });

  it('should map transactions to DTO correctly', () => {
    mockFundRepository.getFunds.mockReturnValue(of(mockFunds));

    mockTransactionRepository.getTransactions.mockReturnValue(of(mockTransactions));

    useCase.execute().subscribe((result) => {
      expect(result.length).toBe(2);

      expect(result[0].fundName).toBe('Fondo Pensiones');

      expect(result[1].fundName).toBe('Fondo Inversión');
    });
  });

  it('should return "Fondo no encontrado" when fund does not exist', () => {
    const transactionsWithUnknownFund: Transaction[] = [
      {
        id: 'tx3',
        fundId: '99',
        type: 'SUBSCRIPTION',
        amount: 30000,
        date: new Date(),
      },
    ];

    mockFundRepository.getFunds.mockReturnValue(of(mockFunds));

    mockTransactionRepository.getTransactions.mockReturnValue(of(transactionsWithUnknownFund));

    useCase.execute().subscribe((result) => {
      expect(result[0].fundName).toBe('Fondo no encontrado');
    });
  });

  it('should return empty array when no transactions exist', () => {
    mockFundRepository.getFunds.mockReturnValue(of(mockFunds));

    mockTransactionRepository.getTransactions.mockReturnValue(of([]));

    useCase.execute().subscribe((result) => {
      expect(result).toEqual([]);
    });
  });

  it('should call repositories to get funds and transactions', () => {
    mockFundRepository.getFunds.mockReturnValue(of(mockFunds));

    mockTransactionRepository.getTransactions.mockReturnValue(of(mockTransactions));

    useCase.execute().subscribe();

    expect(mockFundRepository.getFunds).toHaveBeenCalled();

    expect(mockTransactionRepository.getTransactions).toHaveBeenCalled();
  });
});
