import { Component, effect, inject, Input } from '@angular/core';
import { ProductGalleryService } from './product-gallery.service';
import { ProductModel } from '../product.model';
import { CommonModule } from '@angular/common';
import { CreateRatingStarsDirective } from '../../shared/directives/create-rating-stars.directive';
import { DiscountPricePipe } from '../../shared/pipes/discount-price.pipe';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { shuffleArray } from '../../shared/utils/shuffleArray';
import { ProductFilterComponent } from '../product-filter/product-filter.component';

@Component({
  selector: 'app-product-gallery',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CreateRatingStarsDirective,
    DiscountPricePipe,
    ProductFilterComponent
  ],
  templateUrl: './product-gallery.component.html',
  styleUrl: './product-gallery.component.scss'
})
export class ProductGalleryComponent {
  private productGalleryService = inject(ProductGalleryService);
  private activatedRoute = inject(ActivatedRoute);
  public products: ProductModel[] = [];

  productEffect = effect(() => {
    this.products = this.productGalleryService.productSignal();
    const sortOption = this.productGalleryService.productOptionsSignal().sortOption;

    if (!sortOption) {
      // this.products = shuffleArray(this.products);
    }

    console.log('ProductGalleryComponent.products', this.products)
  })

  ngOnInit() {
    console.log("ProductGalleryComponent.ngOnInit called")
    this.getProducts();
  }

  private getProducts = () => {
    const categoryId = this.activatedRoute.snapshot.paramMap.get('categoryId') as string || "";
    console.log("ProductGalleryComponent.categoryId", categoryId);
    this.productGalleryService.getProducts(categoryId);
  }


}
