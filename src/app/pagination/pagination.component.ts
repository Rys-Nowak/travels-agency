import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TripsService } from '../trips/trips.service';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent {
  @Input() currentPage: number = 1;
  @Input() itemsPerPage: number = 5;
  totalItems: number = this.tripsService.trips.length;
  @Output() pageChange = new EventEmitter<number>();
  totalPages: number = this.calculateTotalPages(this.totalItems);

  constructor(private tripsService: TripsService) {
    this.tripsService.tripsSubject.subscribe((trips) => {
      this.totalItems = trips.length;
      this.totalPages = this.calculateTotalPages(trips.length);
    })
  }

  ngOnChanges(): void {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
  }

  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.pageChange.emit(this.currentPage);
    }
  }

  prevPage(): void {
    this.setPage(this.currentPage - 1);
  }

  nextPage(): void {
    this.setPage(this.currentPage + 1);
  }

  calculateTotalPages(items: number) {
    return Math.ceil(items / this.itemsPerPage);
  }
}
