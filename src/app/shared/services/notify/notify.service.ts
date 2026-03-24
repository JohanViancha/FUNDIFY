import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { NotifyComponent, NotifyData } from '../../components/notify/notify.component';

@Injectable({
  providedIn: 'root',
})
export class NotifyService {
  private dialog = inject(MatDialog);

  open(config: NotifyData): Observable<boolean> {
    const dialogRef = this.dialog.open(NotifyComponent, {
      width: '400px',
      data: config,
      autoFocus: false,
    });

    return dialogRef.afterClosed();
  }
}
