import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of } from 'rxjs';

import { GetBalanceUseCase } from './get-balance.use-case';
import { BALANCE_REPOSITORY_TOKEN } from '../../domain/repositories/balance.tokens';
import { Balance } from '../../domain/models/balance.model';

describe('GetBalanceUseCase', () => {
  let useCase: GetBalanceUseCase;

  const mockRepository = {
    getBalance: vi.fn(),
  };

  const mockBalance: Balance = {
    available: 500000,
    lastUpdated: new Date(),
    hasMadeFirstTransaction: false
  };

  beforeEach(() => {
    mockRepository.getBalance.mockReturnValue(of(mockBalance));

    TestBed.configureTestingModule({
      providers: [
        GetBalanceUseCase,
        {
          provide: BALANCE_REPOSITORY_TOKEN,
          useValue: mockRepository,
        },
      ],
    });

    useCase = TestBed.inject(GetBalanceUseCase);
  });

  it('should create use case', () => {
    expect(useCase).toBeTruthy();
  });

  it('should call repository getBalance()', () => {
    useCase.execute().subscribe();

    expect(mockRepository.getBalance).toHaveBeenCalled();
  });


  it('should return balance from repository', async () => {
    const result = await firstValueFrom(useCase.execute());

    expect(result).toEqual(mockBalance);
  });

  it('should return observable', () => {
    const result = useCase.execute();

    expect(result).toBeDefined();
    expect(typeof result.subscribe).toBe('function');
  });
});
