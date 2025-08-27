import { Component, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductOptions } from '../product-options';
import { ProductGalleryService } from '../product-gallery/product-gallery.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-filter',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './product-filter.component.html',
  styleUrl: './product-filter.component.scss'
})
export class ProductFilterComponent {
  private productGalleryService = inject(ProductGalleryService)
  public productOptions: ProductOptions = this.productGalleryService.productOptionsSignal();
  public uniqueColors: string[] = [];

  public sortOptions = [
    'Price High to Low',
    'Price Low to High',
    'Rating',
    'Clear Filters'
  ]

  private productOptionsEffect = effect(() => {
    this.productOptions = this.productGalleryService.productOptionsSignal();
    console.log('ProductFilterComponent.productOptions', this.productOptions)
  })

  productEffect = effect(() => {
    this.uniqueColors = this.productGalleryService.uniqueColorsSignal();
    // console.log('ProductFilterComponent.uniqueColors', this.uniqueColors);
  })


  public getProducts = () => {
    console.log('ProductFilterComponent.productOptions', this.productOptions);
    this.productGalleryService.setOptions(this.productOptions);
    this.productGalleryService.getProducts();
  }

  public resetOptions = () => {
    this.productGalleryService.resetOptions();
  }

}
