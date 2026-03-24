import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { GetTransactionsUseCase } from '../../../application/use-cases/get-transactions.use-case';
import { TransactionDto } from '../../../application/dtos/transaction.dto';
import { TransactionType } from '../../../domain/models/transaction.model';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-transactions-list',
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatChipsModule,
    DatePipe,
    CurrencyPipe,
    PaginationComponent,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './transactions-list.componet.html',
  styleUrl: './transactions-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsListComponent implements OnInit {
  private getTransactionsUseCase = inject(GetTransactionsUseCase);
  displayedColumns: string[] = ['fundName', 'type', 'amount', 'date'];
  public readonly filterType = signal<TransactionType | 'ALL'>('ALL');
  public readonly pageSize = signal(10);
  public readonly pageIndex = signal(0);
  public readonly filterFund = signal('');

  transactions = signal<TransactionDto[]>([]);

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions() {
    this.getTransactionsUseCase
      .execute()
      .subscribe((transactions) => this.transactions.set(transactions));
  }

  getTypeLabel(type: TransactionType): string {
    return type === 'SUBSCRIPTION' ? 'Suscripción' : 'Cancelación';
  }

  getColor(type: TransactionType): string {
    return type === 'SUBSCRIPTION' ? 'primary-chip' : 'error-chip';
  }

  public readonly typeOptions: Array<{ value: TransactionType | 'ALL'; label: string }> = [
    { value: 'ALL', label: 'Todas' },
    { value: 'SUBSCRIPTION', label: 'Suscripciones' },
    { value: 'CANCELLATION', label: 'Cancelaciones' },
  ];

  public readonly filteredTransactions = computed(() => {
    let filtered = this.transactions();

    const fundQuery = this.filterFund().toLowerCase().trim();
    if (fundQuery) {
      filtered = filtered.filter((tx) => tx.fundName.toLowerCase().includes(fundQuery));
    }

    if (this.filterType() !== 'ALL') {
      filtered = filtered.filter((tx) => tx.type === this.filterType());
    }
    return filtered;
  });

  public readonly paginationConfig = computed(() => ({
    totalCount: this.filteredTransactions().length,
    pageSize: this.pageSize(),
    pageIndex: this.pageIndex(),
  }));

  public readonly displayedTransactions = computed(() => {
    const filtered = this.filteredTransactions();
    const start = this.pageIndex() * this.pageSize();
    return filtered.slice(start, start + this.pageSize());
  });

  onPageChange(event: PageEvent) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  onFilterChange(type: TransactionType | 'ALL') {
    this.filterType.set(type);
    this.pageIndex.set(0);
  }
}
