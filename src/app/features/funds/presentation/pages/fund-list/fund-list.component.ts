import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { Fund } from '../../../domain/models/fund.model';
import { GetFundsUseCase } from '../../../application/use-cases/get-funds.use-case';
@Component({
  selector: 'app-fund-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatCardModule, MatSnackBarModule],
  templateUrl: './fund-list.component.html',
})
export class FundListComponent implements OnInit {
  private getFundsUseCase = inject(GetFundsUseCase);

  displayedColumns: string[] = ['id', 'name', 'category', 'minimumAmount', 'actions'];
  funds = signal<Fund[]>([]);

  constructor(private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadFunds();
  }

  loadFunds() {
    this.getFundsUseCase.execute().subscribe((funds) => this.funds.set(funds));
  }

}
