import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { PaginationComponent, PaginationConfig } from './pagination.component';

import { MatPaginator, PageEvent } from '@angular/material/paginator';

describe('PaginationComponent', () => {
  let fixture: ComponentFixture<PaginationComponent>;
  let component: PaginationComponent;

  const mockConfig: PaginationConfig = {
    totalCount: 100,
    pageSize: 10,
    pageIndex: 0,
    pageSizeOptions: [5, 10, 25, 50],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;

    component.config = mockConfig;

    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should render mat-paginator', () => {
    const paginator = fixture.debugElement.query(By.directive(MatPaginator));

    expect(paginator).toBeTruthy();
  });

  it('should bind paginator inputs correctly', () => {
    const paginator = fixture.debugElement.query(By.directive(MatPaginator))
      .componentInstance as MatPaginator;

    expect(paginator.length).toBe(mockConfig.totalCount);
    expect(paginator.pageSize).toBe(mockConfig.pageSize);
    expect(paginator.pageIndex).toBe(mockConfig.pageIndex);
  });

  it('should use default pageSizeOptions when not provided', () => {
    component.config = {
      totalCount: 50,
      pageSize: 5,
      pageIndex: 0,
    };

    fixture.detectChanges();

    const paginator = fixture.debugElement.query(By.directive(MatPaginator))
      .componentInstance as MatPaginator;

    expect(paginator.pageSizeOptions).toEqual([5, 10, 25, 50]);
  });

  it('should emit pageChange when paginator emits page event', () => {
    const spy = vi.spyOn(component.pageChange, 'emit');

    const pageEvent: PageEvent = {
      pageIndex: 1,
      pageSize: 10,
      length: 100,
      previousPageIndex: 0,
    };

    component.onPageChange(pageEvent);

    expect(spy).toHaveBeenCalledWith(pageEvent);
  });

  it('should trigger pageChange from template event', () => {
    const spy = vi.spyOn(component.pageChange, 'emit');

    const paginator = fixture.debugElement.query(By.directive(MatPaginator))
      .componentInstance as MatPaginator;

    const pageEvent: PageEvent = {
      pageIndex: 2,
      pageSize: 25,
      length: 100,
      previousPageIndex: 1,
    };

    paginator.page.emit(pageEvent);

    expect(spy).toHaveBeenCalledWith(pageEvent);
  });
});
