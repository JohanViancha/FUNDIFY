import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarAction,
  MatSnackBarLabel,
  MatSnackBarRef,
} from '@angular/material/snack-bar';

export interface SnackbarData {
  message: string;
}

@Component({
  selector: 'app-snackbar',
  imports: [MatIconModule, MatButtonModule, MatSnackBarLabel, MatSnackBarAction],
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss'],
})
export class SnackbarComponent {
  public data = inject<SnackbarData>(MAT_SNACK_BAR_DATA);
  public snackBargRef = inject(MatSnackBarRef<SnackbarComponent>);

  close() {
    this.snackBargRef.dismissWithAction();
  }
}
