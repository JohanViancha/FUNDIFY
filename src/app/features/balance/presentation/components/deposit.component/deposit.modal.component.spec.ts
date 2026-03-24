import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { DepositModalComponent } from './deposit.modal.component';
import { DepositModalData } from './models/deposit-modal-data';
import { registerLocaleData } from '@angular/common';
import localeEsCo from '@angular/common/locales/es-CO';

registerLocaleData(localeEsCo);


describe('DepositModalComponent', () => {
  let component: DepositModalComponent;
  let fixture: ComponentFixture<DepositModalComponent>;

  const dialogRefMock = {
    close: vi.fn(),
  };

  const mockData: DepositModalData = {
    currentBalance: 500000,
    minimumDeposit: 50000,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepositModalComponent, NoopAnimationsModule],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: mockData,
        },
        {
          provide: MatDialogRef,
          useValue: dialogRefMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DepositModalComponent);

    component = fixture.componentInstance;

    fixture.detectChanges();

    vi.clearAllMocks();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should load dialog data correctly', () => {
    expect(component.currentBalance).toBe(mockData.currentBalance);

    expect(component.data.minimumDeposit).toBe(mockData.minimumDeposit);
  });

  it('should have invalid form initially', () => {
    expect(component.form.invalid).toBe(true);
  });

  it('should validate required amount', () => {
    component.form.get('amount')?.setValue('');

    expect(component.form.get('amount')?.hasError('required')).toBe(true);
  });

  it('should validate minimum amount', () => {
    component.form.get('amount')?.setValue('1000');

    expect(component.form.get('amount')?.hasError('min')).toBe(true);
  });

  it('should have valid form when amount >= minimum', () => {
    component.form.get('amount')?.setValue(String(mockData.minimumDeposit));

    expect(component.form.valid).toBe(true);
  });

  it('should close dialog with deposit event when form is valid', () => {
    const amount = 100000;

    component.form.get('amount')?.setValue(String(amount));

    component.deposit();

    expect(dialogRefMock.close).toHaveBeenCalledTimes(1);

    const event = dialogRefMock.close.mock.calls[0][0];

    expect(event.amount).toBe(amount);

    expect(typeof event.close).toBe('function');
  });

  it('should not close dialog when form is invalid', () => {
    component.form.get('amount')?.setValue('');

    component.deposit();

    expect(dialogRefMock.close).not.toHaveBeenCalled();
  });

  it('should call dialogRef.close when event.close() is executed', () => {
    const amount = 100000;

    component.form.get('amount')?.setValue(String(amount));

    component.deposit();

    const event = dialogRefMock.close.mock.calls[0][0];

    event.close();

    expect(dialogRefMock.close).toHaveBeenCalledTimes(2);
  });
});
