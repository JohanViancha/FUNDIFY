import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface NotifyData {
  title: string;
  content: string;
  buttonConfirmText?: string;
  buttonCancelText?: string;
  showCloseButton?: boolean;
}

@Component({
  selector: 'app-notify',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './notify.component.html',
  styleUrl: './notify.component.scss',
})
export class NotifyComponent {
  public data = inject<NotifyData>(MAT_DIALOG_DATA);
  public dialogRef = inject(MatDialogRef<NotifyComponent>);

  close() {
    this.dialogRef.close();
  }
}
