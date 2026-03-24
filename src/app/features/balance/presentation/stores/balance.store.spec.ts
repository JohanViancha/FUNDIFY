import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { BalanceStore } from './balance.store';
import { GetBalanceUseCase } from '../../application/use-cases/get-balance.use-case';
import { Balance } from '../../domain/models/balance.model';

describe('BalanceStore', () => {
  let store: InstanceType<typeof BalanceStore>;

  const getBalanceUseCaseMock = {
    execute: vi.fn(),
  };

  const mockBalance: Balance = {
    available: 500000,
    hasMadeFirstTransaction: true,
    lastUpdated: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    getBalanceUseCaseMock.execute.mockReturnValue(of(mockBalance));

    TestBed.configureTestingModule({
      providers: [
        BalanceStore,
        {
          provide: GetBalanceUseCase,
          useValue: getBalanceUseCaseMock,
        },
      ],
    });

    store = TestBed.inject(BalanceStore);
  });

  it('should create store', () => {
    expect(store).toBeTruthy();
  });

  it('should initialize with loading false', () => {
    expect(store.loading()).toBe(false);
  });

  it('should load balance successfully', () => {
    store.loadBalance();

    expect(getBalanceUseCaseMock.execute).toHaveBeenCalled();

    expect(store.balance()).toEqual(mockBalance);

    expect(store.loading()).toBe(false);

    expect(store.error()).toBeNull();
  });

  it('should handle load balance error', () => {
    getBalanceUseCaseMock.execute.mockReturnValue(throwError(() => new Error('fail')));

    store.loadBalance();

    expect(store.loading()).toBe(false);

    expect(store.error()).toBe('Error cargando balance');

    expect(store.balance()).toBeNull();
  });

  it('should set balance manually', () => {
    store.setBalance(mockBalance);

    expect(store.balance()).toEqual(mockBalance);

    expect(store.loading()).toBe(false);

    expect(store.error()).toBeNull();
  });

  it('should compute hasMadeFirstTransaction correctly', () => {
    store.setBalance(mockBalance);

    expect(store.hasMadeFirstTransaction()).toBe(true);
  });

  it('should compute hasMadeFirstTransaction false when no balance', () => {
    store.setBalance({
      ...mockBalance,
      hasMadeFirstTransaction: false,
    });

    expect(store.hasMadeFirstTransaction()).toBe(false);
  });

  it('should call loadBalance on init', () => {
    expect(getBalanceUseCaseMock.execute).toHaveBeenCalled();
  });
});
