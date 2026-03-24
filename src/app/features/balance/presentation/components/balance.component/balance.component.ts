import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { BalanceStore } from '../../stores/balance.store';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { DepositModalComponent } from '../deposit.component/deposit.modal.component';
import { DepositEvent } from '../deposit.component/models/deposit-event';
import { UpdateBalanceUseCase } from '../../../application/use-cases/update-balance.use-case';
import { NotifyService } from '../../../../../shared/services/notify/notify.service';
import { AppError } from '../../../../../shared/domain/errors/app-error';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../../../../../shared/components/snackbar/snackbar.component';

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
  private currencyPipe = inject(CurrencyPipe)
  balanceStore = inject(BalanceStore);

  availableBalance = this.balanceStore.balance;

  formatAmount(amount: number): string {
    return (
      this.currencyPipe.transform(
        amount,
        'COP',
        'symbol',
        '1.0-0',
        'es-CO',
      ) || '$ 0'
    );
  }

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
            this.balanceStore.setBalance(balance);
            this._snackBar.openFromComponent(SnackbarComponent, {
              duration: 5 * 1000,
              data: {
                message: `Haz depositado ${this.formatAmount(result.amount)} a tu cuenta.`,
              },
            });
          },
          error: (error: AppError) =>
            this.notifyService.open({
              title: error.title,
              content: error.message,
            }),
        });
      }
    });
  }
}
