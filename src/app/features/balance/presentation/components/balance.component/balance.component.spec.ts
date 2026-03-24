import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { BalanceComponent } from './balance.component';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { BalanceStore } from '../../stores/balance.store';
import { UpdateBalanceUseCase } from '../../../application/use-cases/update-balance.use-case';
import { NotifyService } from '../../../../../shared/services/notify/notify.service';

import { CurrencyPipe, registerLocaleData } from '@angular/common';
import { DepositModalComponent } from '../deposit.component/deposit.modal.component';
import { SnackbarComponent } from '../../../../../shared/components/snackbar/snackbar.component';
import localeEsCo from '@angular/common/locales/es-CO';

registerLocaleData(localeEsCo);
describe('BalanceComponent', () => {
  let component: BalanceComponent;
  let fixture: ComponentFixture<BalanceComponent>;

  let dialogMock: any;
  let snackBarMock: any;
  let balanceStoreMock: any;
  let updateBalanceUseCaseMock: any;
  let notifyServiceMock: any;

  beforeEach(async () => {
    dialogMock = {
      open: vi.fn(),
    };

    snackBarMock = {
      openFromComponent: vi.fn(),
    };

    balanceStoreMock = {
      balance: vi.fn(() => ({
        available: 100000,
      })),
      setBalance: vi.fn(),
    };

    updateBalanceUseCaseMock = {
      execute: vi.fn(),
    };

    notifyServiceMock = {
      open: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [BalanceComponent],
      providers: [
        CurrencyPipe,

        { provide: MatDialog, useValue: dialogMock },
        { provide: MatSnackBar, useValue: snackBarMock },
        { provide: BalanceStore, useValue: balanceStoreMock },
        {
          provide: UpdateBalanceUseCase,
          useValue: updateBalanceUseCaseMock,
        },
        {
          provide: NotifyService,
          useValue: notifyServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BalanceComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format amount correctly', () => {
    const result = component.formatAmount(50000);

    expect(result).toContain('$');
  });

  it('should open deposit modal', () => {
    dialogMock.open.mockReturnValue({
      afterClosed: () => of(undefined),
    });

    component.openDepositModal();

    expect(dialogMock.open).toHaveBeenCalledWith(
      DepositModalComponent,
      expect.objectContaining({
        width: '480px',
      }),
    );
  });

  it('should update balance and show snackbar on successful deposit', () => {
    const mockResult = {
      amount: 50000,
    };

    const newBalance = {
      available: 150000,
    };

    dialogMock.open.mockReturnValue({
      afterClosed: () => of(mockResult),
    });

    updateBalanceUseCaseMock.execute.mockReturnValue(of(newBalance));

    component.openDepositModal();

    expect(updateBalanceUseCaseMock.execute).toHaveBeenCalledWith(50000, 'DEPOSIT');

    expect(balanceStoreMock.setBalance).toHaveBeenCalledWith(newBalance);

    expect(snackBarMock.openFromComponent).toHaveBeenCalledWith(
      SnackbarComponent,
      expect.objectContaining({
        duration: 5000,
      }),
    );
  });

  // 🧪 5. flujo error
  it('should notify error when update fails', () => {
    const mockResult = {
      amount: 50000,
    };

    const errorMock = {
      title: 'Error',
      message: 'Deposit failed',
    };

    dialogMock.open.mockReturnValue({
      afterClosed: () => of(mockResult),
    });

    updateBalanceUseCaseMock.execute.mockReturnValue(throwError(() => errorMock));

    component.openDepositModal();

    expect(notifyServiceMock.open).toHaveBeenCalledWith({
      title: errorMock.title,
      content: errorMock.message,
    });
  });
});
