import { beforeEach, describe, expect, it, vi } from 'vitest';

import { registerLocaleData } from '@angular/common';
import localeEsCo from '@angular/common/locales/es-CO';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { TransactionDto } from '../../../application/dtos/transaction.dto';
import { GetTransactionsUseCase } from '../../../application/use-cases/get-transactions.use-case';
import { TransactionsListComponent } from './transactions-list.component';
registerLocaleData(localeEsCo);

describe('TransactionsListComponent', () => {
  let component: TransactionsListComponent;
  let fixture: ComponentFixture<TransactionsListComponent>;

  const mockTransactions: TransactionDto[] = [
    {
      id: 't1',
      fundName: 'Fondo Pensiones',
      type: 'SUBSCRIPTION',
      amount: 100000,
      date: new Date('2024-01-01'),
    },
    {
      id: 't2',
      fundName: 'Fondo Inversión',
      type: 'CANCELLATION',
      amount: 50000,
      date: new Date('2024-02-01'),
    },
  ];

  const getTransactionsUseCaseMock = {
    execute: vi.fn(),
  };

  beforeEach(async () => {
    getTransactionsUseCaseMock.execute.mockReturnValue(of(mockTransactions));

    await TestBed.configureTestingModule({
      imports: [TransactionsListComponent],
      providers: [
        {
          provide: GetTransactionsUseCase,
          useValue: getTransactionsUseCaseMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionsListComponent);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should call execute on init', () => {
    expect(getTransactionsUseCaseMock.execute).toHaveBeenCalled();
  });

  it('should load transactions into signal', () => {
    const transactions = component.transactions();

    expect(transactions.length).toBe(2);
  });

  it('should render transaction rows', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    const rows = compiled.querySelectorAll('tr');

    expect(rows.length).toBeGreaterThan(1);

    expect(compiled.textContent).toContain('Fondo Pensiones');

    expect(compiled.textContent).toContain('Fondo Inversión');
  });

  it('should show empty state when no transactions', async () => {
    getTransactionsUseCaseMock.execute.mockReturnValue(of([]));

    fixture = TestBed.createComponent(TransactionsListComponent);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('No hay transacciones registradas.');
  });

  it('should return correct label for SUBSCRIPTION', () => {
    const label = component.getTypeLabel('SUBSCRIPTION');

    expect(label).toBe('Suscripción');
  });

  it('should return correct label for CANCELLATION', () => {
    const label = component.getTypeLabel('CANCELLATION');

    expect(label).toBe('Cancelación');
  });

  it('should return primary-chip for SUBSCRIPTION', () => {
    const color = component.getColor('SUBSCRIPTION');

    expect(color).toBe('primary-chip');
  });

  it('should return error-chip for CANCELLATION', () => {
    const color = component.getColor('CANCELLATION');

    expect(color).toBe('error-chip');
  });
});
