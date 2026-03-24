import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CurrencyDirective } from '../../../../../shared/directive/currency.directive';
import { InvestmentData, NotificationType } from './investment-modal.model';

@Component({
  selector: 'app-investment-modal.component',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    CurrencyDirective
  ],
  templateUrl: './investment-modal.component.html',
  styleUrl: './investment-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvestmentModalComponent {
  private fb = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<InvestmentModalComponent>);
  public data = inject(MAT_DIALOG_DATA);

  form = this.fb.group({
    amount: [0, [Validators.required, Validators.min(this.data.fund.minimumAmount)]],
    notificationType: ['SMS', Validators.required],
  });

  fund = this.data.fund;

  onSubmit() {
    if (this.form.valid) {
      const raw = this.form.value!;
      const data: InvestmentData = {
        amount: raw.amount ?? 0,
        notificationType: (raw.notificationType as NotificationType) ?? 'SMS',
      };
      this.dialogRef.close(data);
    }
  }

  close() {
    this.dialogRef.close();
  }
}
