import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { Chart, ChartConfiguration, ChartData, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { GetFundsUseCase } from '../../../../funds/application/use-cases/get-funds.use-case';
import { GetTransactionsUseCase } from '../../../../transactions/application/use-cases/get-transactions.use-case';

Chart.register(...registerables);

@Component({
  selector: 'app-portfolio.component',
  imports: [CommonModule, BaseChartDirective, MatCardModule],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioComponent {
  private getFundsUseCase = inject(GetFundsUseCase);
  private getTransactionUseCase = inject(GetTransactionsUseCase);

  private fundsSignal = toSignal(this.getFundsUseCase.execute(), { initialValue: [] });
  private transactionsSignal = toSignal(this.getTransactionUseCase.execute(), { initialValue: [] });

  pieChartData = computed<ChartData<'pie'>>(() => {
    const funds = this.fundsSignal();
    return {
      labels: funds.map((f) => f.name),
      datasets: [
        {
          data: funds.map((f) => f.amountInvested),
        },
      ],
    };
  });

  activeFunds = computed(() => {
    const funds = this.fundsSignal();
    return funds.filter((fund) => fund.isSubscribed);
  });

  totalInvested = computed(() => {
    return this.activeFunds().reduce((total, fund) => total + fund.amountInvested, 0);
  });

  activeFundsCount = computed(() => {
    return this.activeFunds().length;
  });

  pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
  };

  totalTransactions = computed(() => {
    const funds = this.transactionsSignal();
    return funds.length;
  });

  barChartData = computed(() => {
    const transactions = this.transactionsSignal();
    const subscriptions = transactions.filter((t) => t.type === 'SUBSCRIPTION').length;
    const cancellations = transactions.filter((t) => t.type === 'CANCELLATION').length;

    return {
      labels: ['Suscripciones', 'Cancelaciones'],
      datasets: [
        {
          label: 'Transacciones',
          data: [subscriptions, cancellations],
        },
      ],
    };
  });

  barChartOptions = {
    responsive: true,
  };
}
