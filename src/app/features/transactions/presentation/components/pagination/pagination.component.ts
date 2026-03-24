// shared/ui/pagination/pagination.component.ts
import { Component, EventEmitter, Input, Output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

export interface PaginationConfig {
  totalCount: number;
  pageSize: number;
  pageIndex: number;
  pageSizeOptions?: number[];
}

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, MatPaginatorModule],
  templateUrl: './pagination.component.html'
})
export class PaginationComponent {
  @Input({ required: true }) config!: PaginationConfig;
  @Output() pageChange = new EventEmitter<PageEvent>();

  onPageChange(event: PageEvent) {
    this.pageChange.emit(event);
  }
}
