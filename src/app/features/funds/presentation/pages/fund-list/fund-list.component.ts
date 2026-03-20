import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

interface Fund {
  id: string;
  name: string;
  minAmount: number;
  category: string;
}

@Component({
  selector: 'app-fund-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatCardModule, MatSnackBarModule],
  templateUrl: './fund-list.component.html',
})
export class FundListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'category', 'minAmount', 'actions'];

  funds = signal<Fund[]>([]);
  userBalance = signal<number>(100000);

  constructor(private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadFunds();
  }

  loadFunds() {
    this.funds.set([
      {
        id: '1',
        name: 'Fondo de Pensiones Voluntarias',
        minAmount: 75000,
        category: 'FPV_BTG_PACTUAL_RECAUDADORA',
      },
      {
        id: '2',
        name: 'Fondo de Pensiones Voluntarias',
        minAmount: 125000,
        category: 'FPV_BTG_PACTUAL_ECOPETROL',
      },
      { id: '3', name: 'Fondo de Inversión Colectiva', minAmount: 50000, category: 'DEUDAPRIVADA' },
      {
        id: '4',
        name: 'Fondo de Inversión Colectiva',
        minAmount: 250000,
        category: 'FDO-ACCIONES',
      },
      {
        id: '5',
        name: 'Fondo de Pensiones Voluntarias',
        minAmount: 100000,
        category: 'FPV_BTG_PACTUAL_DINAMICA',
      },
    ]);
  }

  subscribe(fund: Fund) {
    if (this.userBalance() < fund.minAmount) {
      this.snackBar.open('No tienes saldo suficiente', 'Cerrar', {
        duration: 3000,
      });
      return;
    }

    this.userBalance.update((balance) => balance - fund.minAmount);

    this.snackBar.open(`Te suscribiste a ${fund.name}`, 'OK', {
      duration: 3000,
    });
  }
}
