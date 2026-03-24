import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it } from 'vitest';

import { CurrencyDirective } from './currency.directive';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyDirective],
  template: `
    <input
      type="text"
      [formControl]="control"
      appCurrency
      (rawValueChange)="onRawValueChange($event)"
    />
  `,
})
class TestHostComponent {
  control = new FormControl(0);

  rawValue: number | null = null;

  onRawValueChange(value: number) {
    this.rawValue = value;
  }
}

describe('CurrencyDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let input: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    input = fixture.debugElement.query(By.css('input')).nativeElement;
  });

  it('should create directive', () => {
    const directive = fixture.debugElement.query(By.directive(CurrencyDirective));

    expect(directive).toBeTruthy();
  });

  it('should format currency on input', () => {
    input.value = '10000';

    input.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(input.value).toContain('$');
    expect(input.value).toContain('10.000');
  });

  it('should emit raw value on input', () => {
    input.value = '20000';

    input.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(component.rawValue).toBe(20000);
  });

  it('should update form control with numeric value', () => {
    input.value = '30000';

    input.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(component.control.value).toBe(30000);
  });

  it('should handle non numeric characters', () => {
    input.value = '$40.000';

    input.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(component.control.value).toBe(40000);
  });

  it('should set control to 0 on blur when empty', () => {
    input.value = '';

    input.dispatchEvent(new Event('blur'));

    fixture.detectChanges();

    expect(component.control.value).toBe(0);
  });

  it('should not modify value on blur if not empty', () => {
    component.control.setValue(50000);
    input.value = '$50.000';

    input.dispatchEvent(new Event('blur'));

    fixture.detectChanges();

    expect(component.control.value).toBe(50000);
  });

  it('should format zero correctly', () => {
    input.value = '0';

    input.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(component.control.value).toBe(0);
    expect(input.value).toContain('$');
    expect(input.value).toContain('0');
  });
});
