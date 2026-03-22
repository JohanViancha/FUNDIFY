import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { GetTransactionsUseCase } from '../../../application/use-cases/get-transactions.use-case';
import { TransactionDto } from '../../../application/dtos/transaction.dto';
import { TypeTransaction } from '../../../domain/models/transaction.model';

@Component({
  selector: 'app-transactions-list',
  imports: [CommonModule, MatTableModule, MatCardModule, MatChipsModule, DatePipe, CurrencyPipe],
  templateUrl: './transactions-list.componet.html',
  styleUrl: './transactions-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsListComponent implements OnInit {
  private getTransactionsUseCase = inject(GetTransactionsUseCase);
  displayedColumns: string[] = ['fundName', 'type', 'amount', 'date'];

  transactions = signal<TransactionDto[]>([]);

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions() {
    this.getTransactionsUseCase.execute().subscribe((transactions) => this.transactions.set(transactions));
  }

  getTypeLabel(type: TypeTransaction): string {
    return type === 'SUBSCRIPTION' ? 'Suscripción' : 'Cancelación';
  }

  getColor(type: TypeTransaction): string {
    return type === 'SUBSCRIPTION' ? 'primary-chip' : 'error-chip';
  }
}
