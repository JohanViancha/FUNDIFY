import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { SnackbarComponent } from '../../../../../shared/components/snackbar/snackbar.component';
import { AppError } from '../../../../../shared/domain/errors/app-error';
import { NotifyService } from '../../../../../shared/services/notify/notify.service';
import { BalanceStore } from '../../../../balance/presentation/stores/balance.store';
import { CancelFundUseCase } from '../../../application/use-cases/cancel-to-fund.use-case';
import { GetFundsUseCase } from '../../../application/use-cases/get-funds.use-case';
import { SubscribeToFundUseCase } from '../../../application/use-cases/subscribe-to-fund.use-case';
import { Fund } from '../../../domain/models/fund.model';
import { InvestmentModalComponent } from '../../components/investment-modal.component/investment-modal.component';
import { InvestmentData } from '../../components/investment-modal.component/investment-modal.model';
@Component({
  selector: 'app-fund-list',
  imports: [CommonModule, MatTableModule, MatButtonModule, MatCardModule, MatSnackBarModule],
  templateUrl: './fund-list.component.html',
})
export class FundListComponent implements OnInit {
  private getFundsUseCase = inject(GetFundsUseCase);
  private subscribeToFundUseCase = inject(SubscribeToFundUseCase);
  private cancelFundUseCase = inject(CancelFundUseCase);
  private dialog = inject(MatDialog);
  private notifyService = inject(NotifyService);
  private _snackBar = inject(MatSnackBar);

  public balanceStore = inject(BalanceStore);
  // Configuración tabla Material
  displayedColumns: string[] = ['id', 'name', 'category', 'minimumAmount', 'actions'];
  funds = signal<Fund[]>([]);

  ngOnInit(): void {
    this.loadFunds();
  }

  /**
   * Carga fondos iniciales y refresca post-operaciones
   */
  loadFunds() {
    this.getFundsUseCase.execute().subscribe((funds) => this.funds.set(funds));
  }

  /**
   * Suscribe a fondo vía modal + use case transaccional
   */
  subscribe(fundId: string, result: InvestmentData) {
    this.subscribeToFundUseCase.execute(fundId, result.amount).subscribe({
      next: ({ balance, subscribedFund }) => {
        this.balanceStore.setBalance(balance);
        this.loadFunds();
        this.openSnackBar(`Te has suscrito al fondo ${subscribedFund.name}`);
      },
      error: (err: AppError) => {
        this.notifyService
          .open({
            title: err.title,
            content: err.message,
            showCloseButton: false,
          })
          .subscribe();
      },
    });
  }

  cancel(id: string) {
    this.cancelFundUseCase.execute(id).subscribe({
      next: ({ balance, subscribedFund }) => {
        this.balanceStore.setBalance(balance);
        this.loadFunds();
        this.openSnackBar(`Haz cancelado las suscripción al fondo ${subscribedFund.name}`);
      },
      error: (err) => {
        console.error(err.message);
      },
    });
  }

  /**
   * Abre modal inversión con datos del fondo
   */
  openInvestmentModal(fund: Fund) {
    const dialogRef = this.dialog.open(InvestmentModalComponent, {
      data: { fund },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.subscribe(fund.id, result);
      }
    });
  }

  /**
   * Confirmación para cancelación
   */
  confirmCancel(fund: Fund) {
    this.notifyService
      .open({
        title: 'Cancelar suscripción',
        content: `¿Estás seguro de cancelar tu suscripción a <em>"${fund.name}"</em>?<br>
        <ul>
          <li>Perderás acceso a reportes del fondo</li>
          <li>Se liberará tu saldo invertido</li>
          <li>La acción es <strong>irreversible</strong></li>
        </ul>
        <div>
          <strong>Consejo:</strong> Solo cancela si estás seguro. Puedes reactivar después.
        </div>`,
        showCloseButton: true,
        buttonCancelText: 'No quiero cancelar',
        buttonConfirmText: 'Si, estoy seguro',
      })
      .subscribe((result: boolean) => {
        if (result) {
          this.cancel(fund.id);
        }
      });
  }

  /**
   * SnackBar de éxito genérico (5s)
   */
  openSnackBar(message: string) {
    this._snackBar.openFromComponent(SnackbarComponent, {
      duration: 5 * 1000,
      data: {
        message,
      },
    });
  }
}
