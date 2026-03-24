import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { PortfolioComponent } from './portfolio.component';

import { registerLocaleData } from '@angular/common';
import localeEsCo from '@angular/common/locales/es-CO';
import { GetFundsUseCase } from '../../../../funds/application/use-cases/get-funds.use-case';
import { GetTransactionsUseCase } from '../../../../transactions/application/use-cases/get-transactions.use-case';

registerLocaleData(localeEsCo);


describe('PortfolioComponent', () => {
  let component: PortfolioComponent;
  let fixture: ComponentFixture<PortfolioComponent>;

  const getFundsUseCaseMock = {
    execute: vi.fn(),
  };

  const getTransactionsUseCaseMock = {
    execute: vi.fn(),
  };

  const mockFunds = [
    {
      id: '1',
      name: 'Fondo A',
      minAmount: 50000,
      category: 'FPV',
      isSubscribed: true,
      amountInvested: 100000,
    },
    {
      id: '2',
      name: 'Fondo B',
      minAmount: 75000,
      category: 'FPV',
      isSubscribed: false,
      amountInvested: 50000,
    },
  ];

  const mockTransactions = [
    {
      id: '1',
      fundId: '1',
      type: 'SUBSCRIPTION',
      amount: 100000,
      date: new Date(),
    },
    {
      id: '2',
      fundId: '1',
      type: 'CANCELLATION',
      amount: 50000,
      date: new Date(),
    },
    {
      id: '3',
      fundId: '2',
      type: 'SUBSCRIPTION',
      amount: 75000,
      date: new Date(),
    },
  ];

  beforeEach(async () => {
    getFundsUseCaseMock.execute.mockReturnValue(of(mockFunds));

    getTransactionsUseCaseMock.execute.mockReturnValue(of(mockTransactions));

    await TestBed.configureTestingModule({
      imports: [PortfolioComponent],
      providers: [
        {
          provide: GetFundsUseCase,
          useValue: getFundsUseCaseMock,
        },
        {
          provide: GetTransactionsUseCase,
          useValue: getTransactionsUseCaseMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PortfolioComponent);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should compute pie chart data correctly', () => {
    const data = component.pieChartData();

    expect(data.labels).toEqual(['Fondo A', 'Fondo B']);

    expect(data.datasets[0].data).toEqual([100000, 50000]);
  });

  it('should filter active funds correctly', () => {
    const activeFunds = component.activeFunds();

    expect(activeFunds.length).toBe(1);

    expect(activeFunds[0].name).toBe('Fondo A');
  });

  it('should calculate total invested correctly', () => {
    const total = component.totalInvested();

    expect(total).toBe(100000);
  });

  it('should count active funds correctly', () => {
    const count = component.activeFundsCount();

    expect(count).toBe(1);
  });

  it('should calculate total transactions', () => {
    const total = component.totalTransactions();

    expect(total).toBe(3);
  });

  it('should compute bar chart data correctly', () => {
    const data = component.barChartData();

    expect(data.labels).toEqual(['Suscripciones', 'Cancelaciones']);

    expect(data.datasets[0].data).toEqual([2, 1]);
  });
});
