import { Component, effect, inject } from '@angular/core';
import { ProductSearchService } from './product-search.service';
import { ProductModel } from '../product.model';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DiscountPricePipe } from '../../shared/pipes/discount-price.pipe';
import { CreateRatingStarsDirective } from '../../shared/directives/create-rating-stars.directive';

@Component({
  selector: 'app-product-search',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    DiscountPricePipe,
    CreateRatingStarsDirective
  ],
  templateUrl: './product-search.component.html',
  styleUrl: './product-search.component.scss'
})
export class ProductSearchComponent {
  private productSearchService = inject(ProductSearchService);
  public products: ProductModel[] = [];

  productEffect = effect(() => {
    this.products = this.productSearchService.productSignal();

    console.log('ProductSearchComponent.products', this.products)
  })
}
