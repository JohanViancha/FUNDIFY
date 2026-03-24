import { CommonModule, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DepositModalData } from './models/deposit-modal-data';
import { MatCardModule } from '@angular/material/card';
import { DepositEvent } from './models/deposit-event';
import { CurrencyDirective } from '../../../../../shared/directive/currency.directive';

@Component({
  selector: 'app-deposit.component',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CurrencyPipe,
    MatCardModule,
    CurrencyDirective,
  ],
  templateUrl: './deposit.modal.component.html',
  styleUrl: './deposit.modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepositModalComponent {
  public data = inject<DepositModalData>(MAT_DIALOG_DATA);
  public dialogRef = inject(MatDialogRef<DepositModalComponent>);

  public readonly form = new FormGroup({
    amount: new FormControl('', [Validators.required, Validators.min(this.data.minimumDeposit)]),
  });

  public readonly currentBalance = this.data.currentBalance;

  deposit() {
    if (this.form.valid) {
      const event: DepositEvent = {
        amount: Number(this.form.get('amount')?.value),
        close: () => this.dialogRef.close(),
      };

      this.dialogRef.close(event);
    }
  }
}
