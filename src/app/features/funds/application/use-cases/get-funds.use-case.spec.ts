import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { of, firstValueFrom } from 'rxjs';
import { GetFundsUseCase } from './get-funds.use-case';
import { Fund } from '../../domain/models/fund.model';
import { FUND_REPOSITORY_TOKEN } from '../../domain/repositories/fund.tokens';

describe('GetFundsUseCase', () => {
  let useCase: GetFundsUseCase;

  const fundRepositoryMock = {
    getFunds: vi.fn(),
  };

  const mockFunds: Fund[] = [
    {
      id: '1',
      name: 'Fondo Pensiones',
      minimumAmount: 75000,
      category: 'FPV',
      isSubscribed: false,
      amountInvested: 0,
    },
    {
      id: '2',
      name: 'Fondo Ecopetrol',
      minimumAmount: 125000,
      category: 'FPV',
      isSubscribed: true,
      amountInvested: 200000,
    },
  ];

  beforeEach(() => {
    fundRepositoryMock.getFunds.mockReturnValue(of(mockFunds));

    TestBed.configureTestingModule({
      providers: [
        GetFundsUseCase,
        {
          provide: FUND_REPOSITORY_TOKEN,
          useValue: fundRepositoryMock,
        },
      ],
    });

    useCase = TestBed.inject(GetFundsUseCase);

    vi.clearAllMocks();
  });

  it('should create use case', () => {
    expect(useCase).toBeTruthy();
  });

  it('should call repository.getFunds()', async () => {
    await firstValueFrom(useCase.execute());

    expect(fundRepositoryMock.getFunds).toHaveBeenCalledTimes(1);
  });

  it('should return list of funds', async () => {
    const result = await firstValueFrom(useCase.execute());

    expect(result).toEqual(mockFunds);
    expect(result.length).toBe(2);
  });
});
