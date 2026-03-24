// shared/directives/currency.directive.ts
import { Directive, ElementRef, HostListener, forwardRef, Output, EventEmitter, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appCurrency]',
  standalone: true
})
export class CurrencyDirective {
  @Output() rawValueChange = new EventEmitter<number>();
  private control = inject(NgControl)
  private el = inject(ElementRef<HTMLInputElement>)

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const rawValue = this.parseCurrency(target.value);

    this.rawValueChange.emit(rawValue);

    this.control.control?.setValue(rawValue, { emitEvent: false });

    target.value = this.formatCurrency(rawValue);
  }

  @HostListener('blur')
  onBlur() {
    const target = this.el.nativeElement;
    if (!target.value) {
      this.control.control?.setValue(0, { emitEvent: false });
      target.value = '';
    }
  }

  private parseCurrency(value: string): number {
    return parseFloat(value.replace(/[^\d]/g, '')) || 0;
  }

  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }
}
