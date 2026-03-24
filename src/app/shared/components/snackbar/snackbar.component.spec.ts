import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SnackbarComponent, SnackbarData } from './snackbar.component';

import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

describe('SnackbarComponent', () => {
  let component: SnackbarComponent;
  let fixture: ComponentFixture<SnackbarComponent>;

  let snackBarRefMock: {
    dismissWithAction: ReturnType<typeof vi.fn>;
  };

  const mockData: SnackbarData = {
    message: 'Operación exitosa',
  };

  beforeEach(async () => {
    snackBarRefMock = {
      dismissWithAction: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [SnackbarComponent],
      providers: [
        {
          provide: MAT_SNACK_BAR_DATA,
          useValue: mockData,
        },
        {
          provide: MatSnackBarRef,
          useValue: snackBarRefMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SnackbarComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render message from data', () => {
    const messageElement = fixture.debugElement.query(By.css('[matSnackBarLabel]'));

    expect(messageElement.nativeElement.textContent).toContain(mockData.message);
  });

  it('should dismiss snackbar when close() is called', () => {
    component.close();

    expect(snackBarRefMock.dismissWithAction).toHaveBeenCalled();
  });

  it('should call close when button is clicked', () => {
    const button = fixture.debugElement.query(By.css('button'));

    button.triggerEventHandler('click');

    expect(snackBarRefMock.dismissWithAction).toHaveBeenCalled();
  });
});
