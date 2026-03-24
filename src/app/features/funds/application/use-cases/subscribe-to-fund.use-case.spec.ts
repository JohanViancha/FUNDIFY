import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { of, firstValueFrom } from 'rxjs';

import { SubscribeToFundUseCase } from './subscribe-to-fund.use-case';

import { FUND_REPOSITORY_TOKEN } from '../../domain/repositories/fund.tokens';
import { BALANCE_REPOSITORY_TOKEN } from '../../../balance/domain/repositories/balance.tokens';
import { TRANSACTION_REPOSITORY_TOKEN } from '../../../transactions/domain/repositories/transaction.tokens';

import { Fund } from '../../domain/models/fund.model';
import { Balance } from '../../../balance/domain/models/balance.model';
import { Transaction } from '../../../transactions/domain/models/transaction.model';

import { AppError } from '../../../../shared/domain/errors/app-error';

describe('SubscribeToFundUseCase', () => {
  let useCase: SubscribeToFundUseCase;

  const fundRepositoryMock = {
    getFundById: vi.fn(),
    updateSubscription: vi.fn(),
  };

  const balanceRepositoryMock = {
    getBalance: vi.fn(),
    updateBalance: vi.fn(),
  };

  const transactionRepositoryMock = {
    create: vi.fn(),
  };

  const mockFund: Fund = {
    id: '1',
    name: 'Fondo Test',
    minimumAmount: 50000,
    category: 'FPV',
    isSubscribed: false,
    amountInvested: 0,
  };

  const mockBalance: Balance = {
    available: 200000,
    hasMadeFirstTransaction: true,
    lastUpdated: new Date(),
  };

  const mockTransaction: Transaction = {
    id: '123',
    fundId: '1',
    type: 'SUBSCRIPTION',
    amount: 100000,
    date: new Date(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SubscribeToFundUseCase,
        {
          provide: FUND_REPOSITORY_TOKEN,
          useValue: fundRepositoryMock,
        },
        {
          provide: BALANCE_REPOSITORY_TOKEN,
          useValue: balanceRepositoryMock,
        },
        {
          provide: TRANSACTION_REPOSITORY_TOKEN,
          useValue: transactionRepositoryMock,
        },
      ],
    });

    useCase = TestBed.inject(SubscribeToFundUseCase);

    vi.clearAllMocks();
  });

  it('should subscribe to fund successfully', async () => {
    const amount = 100000;

    fundRepositoryMock.getFundById.mockReturnValue(of(mockFund));

    balanceRepositoryMock.getBalance.mockReturnValue(of(mockBalance));

    transactionRepositoryMock.create.mockReturnValue(of(mockTransaction));

    balanceRepositoryMock.updateBalance.mockReturnValue(of(mockBalance));

    fundRepositoryMock.updateSubscription.mockReturnValue(
      of({
        ...mockFund,
        isSubscribed: true,
        amountInvested: amount,
      }),
    );

    const result = await firstValueFrom(useCase.execute('1', amount));

    expect(fundRepositoryMock.getFundById).toHaveBeenCalledWith('1');

    expect(balanceRepositoryMock.getBalance).toHaveBeenCalled();

    expect(transactionRepositoryMock.create).toHaveBeenCalled();

    expect(balanceRepositoryMock.updateBalance).toHaveBeenCalledWith(amount, 'WITHDRAWAL');

    expect(fundRepositoryMock.updateSubscription).toHaveBeenCalledWith('1', true, amount);

    expect(result.transaction).toEqual(mockTransaction);
  });

  it('should throw error when fund not found', async () => {
    fundRepositoryMock.getFundById.mockReturnValue(of(null));

    await expect(firstValueFrom(useCase.execute('99', 100000))).rejects.toBeInstanceOf(AppError);
  });

  it('should throw error when amount is below minimum', async () => {
    fundRepositoryMock.getFundById.mockReturnValue(of(mockFund));

    balanceRepositoryMock.getBalance.mockReturnValue(of(mockBalance));

    await expect(firstValueFrom(useCase.execute('1', 1000))).rejects.toBeInstanceOf(AppError);
  });

  it('should throw error when balance is insufficient', async () => {
    fundRepositoryMock.getFundById.mockReturnValue(of(mockFund));

    balanceRepositoryMock.getBalance.mockReturnValue(
      of({
        ...mockBalance,
        available: 10000,
      }),
    );

    await expect(firstValueFrom(useCase.execute('1', 50000))).rejects.toBeInstanceOf(AppError);
  });

  it('should create subscription transaction with correct data', async () => {
    const amount = 100000;

    fundRepositoryMock.getFundById.mockReturnValue(of(mockFund));

    balanceRepositoryMock.getBalance.mockReturnValue(of(mockBalance));

    transactionRepositoryMock.create.mockReturnValue(of(mockTransaction));

    balanceRepositoryMock.updateBalance.mockReturnValue(of(mockBalance));

    fundRepositoryMock.updateSubscription.mockReturnValue(of(mockFund));

    await firstValueFrom(useCase.execute('1', amount));

    const transactionData = transactionRepositoryMock.create.mock.calls[0][0];

    expect(transactionData.type).toBe('SUBSCRIPTION');

    expect(transactionData.amount).toBe(amount);

    expect(transactionData.fundId).toBe(mockFund.id);
  });
});
