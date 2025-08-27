import { Component, inject } from '@angular/core';
import { ProductCategoryComponent } from '../product/product-category/product-category.component';
import { ProductGalleryComponent } from '../product/product-gallery/product-gallery.component';
import { ProductGalleryService } from '../product/product-gallery/product-gallery.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ProductCategoryComponent,
    ProductGalleryComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private productGalleryService = inject(ProductGalleryService);

  ngOnInit() {
    this.productGalleryService.resetCategory();
  }
}
