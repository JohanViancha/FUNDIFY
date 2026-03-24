import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { of, firstValueFrom } from 'rxjs';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { NotifyService } from './notify.service';
import {
  NotifyComponent,
  NotifyData
} from '../../components/notify/notify.component';

describe('NotifyService', () => {
  let service: NotifyService;

  const dialogRefMock = {
    afterClosed: vi.fn(),
  };

  const matDialogMock = {
    open: vi.fn(),
  };

  const mockConfig: NotifyData = {
    title: 'Confirmación',
    content: '¿Deseas continuar?',
    buttonConfirmText: 'Sí',
    buttonCancelText: 'No',
  };

  beforeEach(() => {
    dialogRefMock.afterClosed.mockReturnValue(of(true));

    matDialogMock.open.mockReturnValue(
      dialogRefMock as unknown as MatDialogRef<NotifyComponent>
    );

    TestBed.configureTestingModule({
      providers: [
        NotifyService,
        {
          provide: MatDialog,
          useValue: matDialogMock,
        },
      ],
    });

    service = TestBed.inject(NotifyService);
  });

  it('should create service', () => {
    expect(service).toBeTruthy();
  });

  it('should open dialog with correct configuration', () => {
    service.open(mockConfig);

    expect(matDialogMock.open).toHaveBeenCalledWith(
      NotifyComponent,
      {
        width: '400px',
        data: mockConfig,
        autoFocus: false,
      }
    );
  });

  it('should call afterClosed()', () => {
    service.open(mockConfig).subscribe();

    expect(
      dialogRefMock.afterClosed
    ).toHaveBeenCalled();
  });

  it('should return value from afterClosed()', async () => {
    const result = await firstValueFrom(
      service.open(mockConfig)
    );

    expect(result).toBe(true);
  });

  it('should pass correct data to dialog', () => {
    service.open(mockConfig);

    const args = matDialogMock.open.mock.calls[0];

    expect(args[1].data).toEqual(mockConfig);
  });
});
