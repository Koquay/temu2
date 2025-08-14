import { Component } from '@angular/core';
import { ProductSubCategoryComponent } from './product-subcategory/product-subcategory.component';
import { ProductGalleryComponent } from './product-gallery/product-gallery.component';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    ProductSubCategoryComponent,
    ProductGalleryComponent
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent {

}
