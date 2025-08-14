import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductViewService } from './product-view.service';
import { ProductModel } from '../product.model';

@Component({
  selector: 'app-product-view',
  standalone: true,
  imports: [],
  templateUrl: './product-view.component.html',
  styleUrl: './product-view.component.scss'
})
export class ProductViewComponent {
  private activatedRoute = inject(ActivatedRoute);
  private productViewService = inject(ProductViewService);
  public product: ProductModel | undefined;
  public displayProduct = '';

  ngOnInit() {
    this.getSelectedProduct();
  }

  // categoryEffect = effect(() => {
  //   this.productCategory = this.productViewService.productCategorySignal()
  //   console.log("ProductCategoryComponent.productCategory", this.productCategory)
  // })

  private getSelectedProduct = () => {

    const productId = this.activatedRoute.snapshot.paramMap.get('productId') as string;
    console.log("ProductViewComponent.productId", productId);

    this.productViewService.getSelectedProduct(productId).subscribe(product => {
      this.product = product;
      this.displayProduct = product.images[0]
      console.log('ProductViewComponent.product', product)
    })
  }

  public displaySelectedImg = (img: string) => {
    this.displayProduct = img;
  }
}
