import { Component, effect, inject } from '@angular/core';
import { ProductCategoryService } from './product-category.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductGalleryService } from '../product-gallery/product-gallery.service';

@Component({
  selector: 'app-product-category',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './product-category.component.html',
  styleUrl: './product-category.component.scss'
})
export class ProductCategoryComponent {
  private productCategoryService = inject(ProductCategoryService);
  private productGalleryService = inject(ProductGalleryService);
  public productCategory = this.productCategoryService.productCategorySignal()
  public categoriId = '';
  public subcategoriId = '';


  ngOnInit() {
    this.getProductCategory();
  }

  categoryEffect = effect(() => {
    this.productCategory = this.productCategoryService.productCategorySignal()
    console.log("ProductCategoryComponent.productCategory", this.productCategory)
    // this.categoriId = this.productCategory.
  })

  private getProductCategory = () => {
    this.productGalleryService.setSubcategoryId("");
    this.productCategoryService.getProductCategory();
  }
}
