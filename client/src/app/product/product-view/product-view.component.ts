import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductViewService } from './product-view.service';
import { ProductModel } from '../product.model';
import { CreateRatingStarsDirective } from '../../shared/directives/create-rating-stars.directive';
import { CommonModule } from '@angular/common';
import { DiscountPricePipe } from '../../shared/pipes/discount-price.pipe';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../cart/cart.service';
import { CartItem } from '../../cart/cart.item';
import { getScrollPos } from '../../shared/utils/getScrollPos';

@Component({
  selector: 'app-product-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CreateRatingStarsDirective,
    DiscountPricePipe
  ],
  templateUrl: './product-view.component.html',
  styleUrl: './product-view.component.scss'
})
export class ProductViewComponent {
  private activatedRoute = inject(ActivatedRoute);
  private productViewService = inject(ProductViewService);
  private cartService = inject(CartService);

  private toastr = inject(ToastrService);
  public product: ProductModel | undefined;
  public cartItem: CartItem = new CartItem();
  public displayProductImg = '';
  public qtyList = Array.from({ length: 10 }, (_, i) => i + 1);


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
      this.displayProductImg = product.images[0]
      console.log('ProductViewComponent.product', product)
    })
  }

  public displaySelectedImg = (img: string) => {
    this.displayProductImg = img;
  }

  public setCartItemImg = (img: string, name: string) => {
    this.cartItem.img = img;
    this.cartItem.name = name;
    this.displaySelectedImg(img);
  }

  public setCartItemSize = (size: string) => {
    this.cartItem.size = size;
  }

  public addItemToCart = () => {
    if (!this.cartItem.name) {
      this.toastr.info('Please select a color.', '',
        { positionClass: getScrollPos() });
      return;
    } else if (!this.cartItem.size) {
      this.toastr.info('Please select a size.', '',
        { positionClass: getScrollPos() });
      return;
    }

    const newCartItem = new CartItem();
    newCartItem.productId = this.product?._id as string;
    newCartItem.name = this.cartItem.name;
    newCartItem.size = this.cartItem.size;
    newCartItem.qty = this.cartItem.qty;
    newCartItem.img = this.displayProductImg;
    newCartItem.product = this.product as ProductModel;

    this.cartService.addItemToCart(newCartItem);
  }

}
