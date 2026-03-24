import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { NotifyComponent, NotifyData } from './notify.component';

describe('NotifyComponent', () => {
  let component: NotifyComponent;
  let fixture: ComponentFixture<NotifyComponent>;

  const dialogRefMock = {
    close: vi.fn(),
  };

  const mockData: NotifyData = {
    title: 'Título de prueba',
    content: 'Contenido de prueba',
    buttonConfirmText: 'Aceptar',
    showCloseButton: true,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotifyComponent],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: mockData,
        },
        {
          provide: MatDialogRef,
          useValue: dialogRefMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NotifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render title and content', () => {
    const title = fixture.debugElement.query(By.css('h2'));
    const content = fixture.debugElement.query(By.css('mat-dialog-content'));

    expect(title.nativeElement.innerHTML).toContain(mockData.title);

    expect(content.nativeElement.innerHTML).toContain(mockData.content);
  });

  it('should show cancel button when showCloseButton is true', () => {
    const cancelButton = fixture.debugElement
      .queryAll(By.css('button'))
      .find((btn) => btn.nativeElement.textContent.includes('Cancelar'));

    expect(cancelButton).toBeTruthy();
  });

  it('should hide cancel button when showCloseButton is false', async () => {
    TestBed.resetTestingModule();

    await TestBed.configureTestingModule({
      imports: [NotifyComponent],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            ...mockData,
            showCloseButton: false,
          },
        },
        {
          provide: MatDialogRef,
          useValue: dialogRefMock,
        },
      ],
    }).compileComponents();

    const newFixture = TestBed.createComponent(NotifyComponent);
    newFixture.detectChanges();

    const buttons = newFixture.debugElement.queryAll(By.css('button'));

    const cancelButton = buttons.find((btn) => btn.nativeElement.textContent.includes('Cancelar'));

    expect(cancelButton).toBeUndefined();
  });

  it('should call dialogRef.close when close() is executed', () => {
    component.close();

    expect(dialogRefMock.close).toHaveBeenCalled();
  });

  it('should display default button text when buttonText is not provided', async () => {
    TestBed.resetTestingModule();

    await TestBed.configureTestingModule({
      imports: [NotifyComponent],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            title: 'Test',
            content: 'Test content',
          },
        },
        {
          provide: MatDialogRef,
          useValue: dialogRefMock,
        },
      ],
    }).compileComponents();

    const newFixture = TestBed.createComponent(NotifyComponent);
    newFixture.detectChanges();

    const buttons = newFixture.debugElement.queryAll(By.css('button'));

    const mainButton = buttons.find((btn) => btn.nativeElement.textContent.includes('Entendido'));

    expect(mainButton).toBeTruthy();
  });
});
