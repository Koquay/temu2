import { Component, effect, inject } from '@angular/core';
// import { ProductCategoryService } from './product-subcategory.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductCategoryService } from '../product-category/product-category.service';
import { ProductCategoryModel } from '../product-category/product-category.model';
import { ProductGalleryService } from '../product-gallery/product-gallery.service';

@Component({
  selector: 'app-product-sub-category',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './product-subcategory.component.html',
  styleUrl: './product-category.component.scss'
})
export class ProductSubCategoryComponent {
  private activatedRoute = inject(ActivatedRoute);
  private productCategoryService = inject(ProductCategoryService);
  private productGalleryService = inject(ProductGalleryService);
  // public productCategory = this.productCategoryService.productCategorySignal()
  public category: ProductCategoryModel | undefined;

  ngOnInit() {
    this.getCategory();
  }

  // categoryEffect = effect(() => {
  //   this.productCategory = this.productCategoryService.productCategorySignal()
  //   console.log("ProductCategoryComponent.productCategory", this.productCategory)
  // })

  private getCategory = () => {

    const categoryId = this.activatedRoute.snapshot.paramMap.get('categoryId') as string;
    console.log("ProductSubCategoryComponent.categoryId", categoryId);

    this.productCategoryService.getCategory(categoryId).subscribe(category => {
      console.log("ProductSubCategoryComponent.category", category);
      this.category = category;
    })
  }

  public setSubcategoryId = (subcategoryId: string) => {
    console.log("ProductSubCategory.Component.setSubcategoryId", subcategoryId)
    this.productGalleryService.setSubcategoryId(subcategoryId);
    this.productGalleryService.getProducts();
  }
}
