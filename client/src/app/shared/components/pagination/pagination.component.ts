import { CommonModule } from '@angular/common';
import { Component, effect, EventEmitter, inject, Input, Output } from '@angular/core';
import { ProductGalleryService } from '../../../product/product-gallery/product-gallery.service';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent {
  private productGalleryService = inject(ProductGalleryService);
  public pages: number[] = [];
  public pageNo = 1;
  public numberOfPages = 0;
  public pageSize = this.productGalleryService.productOptionsSignal().pageSize;
  @Output() pageChangeEvent = new EventEmitter<number>();

  @Input() set productCount(productCount: number) {
    console.log('this.productCount', productCount)

    this.numberOfPages = Math.ceil(
      productCount / this.pageSize
    );
    console.log('this.numberOfPages', this.numberOfPages)

    this.pages = [];
    for (let i = 1; i <= this.numberOfPages; i++) {
      this.pages.push(i);
    }
  }

  private productOptionsEffect = effect(() => {
    this.pageSize = this.productGalleryService.productOptionsSignal().pageSize;
  })

  public getPage = (pageNo: number) => {
    this.pageNo = pageNo;
    this.pageChangeEvent.emit(this.pageNo)
  }

  public getAdjacentPage(direction: string) {
    console.log('pageNo', direction)
    if (direction === 'next') {
      if (this.pageNo < this.numberOfPages) {
        ++this.pageNo;
        this.pageChangeEvent.emit(this.pageNo);
      }
    } else if (direction === 'prev') {
      if (this.pageNo > 1) {
        --this.pageNo;
        this.pageChangeEvent.emit(this.pageNo);
      }
    }
  }
}
