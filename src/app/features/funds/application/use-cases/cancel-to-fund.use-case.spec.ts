import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { BALANCE_REPOSITORY_TOKEN } from '../../../balance/domain/repositories/balance.tokens';
import { TRANSACTION_REPOSITORY_TOKEN } from '../../../transactions/domain/repositories/transaction.tokens';
import { FUND_REPOSITORY_TOKEN } from '../../domain/repositories/fund.tokens';

import { Balance } from '../../../balance/domain/models/balance.model';
import { Transaction } from '../../../transactions/domain/models/transaction.model';
import { Fund } from '../../domain/models/fund.model';

import { AppError } from '../../../../shared/domain/errors/app-error';
import { CancelFundUseCase } from '../use-cases/cancel-to-fund.use-case';

describe('CancelFundUseCase', () => {
  let useCase: CancelFundUseCase;

  const fundRepositoryMock = {
    getFundById: vi.fn(),
    updateSubscription: vi.fn(),
  };

  const balanceRepositoryMock = {
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
    isSubscribed: true,
    amountInvested: 100000,
  };

  const mockTransaction: Transaction = {
    id: '123',
    fundId: '1',
    type: 'CANCELLATION',
    amount: 100000,
    date: new Date(),
  };

  const mockBalance: Balance = {
    available: 600000,
    hasMadeFirstTransaction: true,
    lastUpdated: new Date(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CancelFundUseCase,
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

    useCase = TestBed.inject(CancelFundUseCase);

    vi.clearAllMocks();
  });

  it('should cancel fund successfully', async () => {
    fundRepositoryMock.getFundById.mockReturnValue(of(mockFund));

    transactionRepositoryMock.create.mockReturnValue(of(mockTransaction));

    balanceRepositoryMock.updateBalance.mockReturnValue(of(mockBalance));

    fundRepositoryMock.updateSubscription.mockReturnValue(
      of({
        ...mockFund,
        isSubscribed: false,
        amountInvested: 0,
      }),
    );

    const result = await firstValueFrom(useCase.execute('1'));

    expect(fundRepositoryMock.getFundById).toHaveBeenCalledWith('1');

    expect(transactionRepositoryMock.create).toHaveBeenCalled();

    expect(balanceRepositoryMock.updateBalance).toHaveBeenCalledWith(
      mockFund.amountInvested,
      'DEPOSIT',
    );

    expect(fundRepositoryMock.updateSubscription).toHaveBeenCalledWith('1', false, 0);

    expect(result.transaction).toEqual(mockTransaction);

    expect(result.balance).toEqual(mockBalance);

    expect(result.subscribedFund.isSubscribed).toBe(false);
  });

  it('should throw error when fund not found', async () => {
    fundRepositoryMock.getFundById.mockReturnValue(of(null));

    await expect(firstValueFrom(useCase.execute('999'))).rejects.toBeInstanceOf(AppError);
  });

  it('should throw error when fund is not subscribed', async () => {
    fundRepositoryMock.getFundById.mockReturnValue(
      of({
        ...mockFund,
        isSubscribed: false,
      }),
    );

    await expect(firstValueFrom(useCase.execute('1'))).rejects.toBeInstanceOf(AppError);
  });

  it('should create cancellation transaction with correct data', async () => {
    fundRepositoryMock.getFundById.mockReturnValue(of(mockFund));

    transactionRepositoryMock.create.mockReturnValue(of(mockTransaction));

    balanceRepositoryMock.updateBalance.mockReturnValue(of(mockBalance));

    fundRepositoryMock.updateSubscription.mockReturnValue(of(mockFund));

    await firstValueFrom(useCase.execute('1'));

    const transactionData = transactionRepositoryMock.create.mock.calls[0][0];

    expect(transactionData.type).toBe('CANCELLATION');

    expect(transactionData.amount).toBe(mockFund.amountInvested);

    expect(transactionData.fundId).toBe(mockFund.id);
  });
});
