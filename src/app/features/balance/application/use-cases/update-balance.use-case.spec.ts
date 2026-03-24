import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { of, firstValueFrom } from 'rxjs';

import { UpdateBalanceUseCase } from './update-balance.use-case';
import { BALANCE_REPOSITORY_TOKEN } from '../../domain/repositories/balance.tokens';
import { Balance } from '../../domain/models/balance.model';

describe('UpdateBalanceUseCase', () => {
  let useCase: UpdateBalanceUseCase;

  const mockRepository = {
    updateBalance: vi.fn(),
  };

  const mockBalance: Balance = {
    available: 600000,
    lastUpdated: new Date(),
    hasMadeFirstTransaction: false
  };

  beforeEach(() => {
    mockRepository.updateBalance.mockReturnValue(
      of(mockBalance)
    );

    TestBed.configureTestingModule({
      providers: [
        UpdateBalanceUseCase,
        {
          provide: BALANCE_REPOSITORY_TOKEN,
          useValue: mockRepository,
        },
      ],
    });

    useCase = TestBed.inject(UpdateBalanceUseCase);
  });

  it('should create use case', () => {
    expect(useCase).toBeTruthy();
  });

  it('should call repository updateBalance with correct parameters', () => {
    const amount = 100000;
    const type = 'DEPOSIT';

    useCase.execute(amount, type).subscribe();

    expect(
      mockRepository.updateBalance
    ).toHaveBeenCalledWith(amount, type);
  });

  it('should return updated balance from repository', async () => {
    const result = await firstValueFrom(
      useCase.execute(100000, 'DEPOSIT')
    );

    expect(result).toEqual(mockBalance);
  });

  it('should return observable', () => {
    const result = useCase.execute(
      50000,
      'WITHDRAWAL'
    );

    expect(result).toBeDefined();
    expect(typeof result.subscribe).toBe('function');
  });

  it('should support WITHDRAWAL type', () => {
    useCase.execute(20000, 'WITHDRAWAL').subscribe();

    expect(
      mockRepository.updateBalance
    ).toHaveBeenCalledWith(
      20000,
      'WITHDRAWAL'
    );
  });
});
