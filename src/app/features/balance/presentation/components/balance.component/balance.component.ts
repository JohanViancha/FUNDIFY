import { CommonModule, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../../../../../shared/components/snackbar/snackbar.component';
import { AppError } from '../../../../../shared/domain/errors/app-error';
import { NotifyService } from '../../../../../shared/services/notify/notify.service';
import { UpdateBalanceUseCase } from '../../../application/use-cases/update-balance.use-case';
import { BalanceStore } from '../../stores/balance.store';
import { DepositModalComponent } from '../deposit.component/deposit.modal.component';
import { DepositEvent } from '../deposit.component/models/deposit-event';

@Component({
  selector: 'app-balance',
  imports: [MatCardModule, MatIconModule, MatButtonModule, CurrencyPipe, CommonModule],
  templateUrl: './balance.component.html',
  styleUrl: './balance.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CurrencyPipe],
})
export class BalanceComponent {
  private dialog = inject(MatDialog);
  private notifyService = inject(NotifyService);
  private updateBalanceUseCase = inject(UpdateBalanceUseCase);
  private _snackBar = inject(MatSnackBar);
  private currencyPipe = inject(CurrencyPipe);
  balanceStore = inject(BalanceStore);

  availableBalance = this.balanceStore.balance;

  /**
   * Formatea montos en formato COP colombiano ($ 1.234.567)
   */
  formatAmount(amount: number): string {
    return (
      this.currencyPipe.transform(
        amount,
        'COP', // Moneda colombiana
        'symbol', // $ símbolo
        '1.0-0', // Sin decimales
        'es-CO', // Localización Colombia
      ) || '$ 0'
    );
  }

  /**
   * Abre modal depósito y procesa resultado.
   * Flujo: Modal → UpdateBalanceUseCase → Store → UI auto-update + SnackBar
   */
  openDepositModal() {
    const dialogRef = this.dialog.open(DepositModalComponent, {
      width: '480px',
      data: {
        currentBalance: this.availableBalance()?.available,
        minimumDeposit: 50,
      },
    });

    dialogRef.afterClosed().subscribe((result: DepositEvent | undefined) => {
      if (result) {
        this.updateBalanceUseCase.execute(result.amount, 'DEPOSIT').subscribe({
          next: (balance) => {
            // Actualiza store
            this.balanceStore.setBalance(balance);
            // Notificación éxito (SnackBar temporal)
            this._snackBar.openFromComponent(SnackbarComponent, {
              duration: 5 * 1000,
              data: {
                message: `Haz depositado ${this.formatAmount(result.amount)} a tu cuenta.`,
              },
            });
          },
          error: (error: AppError) =>
            // Notificación error (modal persistente)
            this.notifyService.open({
              title: error.title,
              content: error.message,
            }),
        });
      }
    });
  }
}
