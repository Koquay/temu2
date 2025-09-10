import { Component, effect, EventEmitter, inject, Output } from '@angular/core';
// import { CartService } from '../../cart/cart.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../cart/cart.service';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.scss'
})
export class OrderSummaryComponent {
  private cartService = inject(CartService);
  public cart = this.cartService.cartSignal().cartModel.cart
  public totalWithDiscount = 0;
  public total = 0;
  public discount = 0;
  @Output() cartTotalEvent = new EventEmitter<number>();

  cartEffect = effect(() => {
    this.cart = this.cartService.cartSignal().cartModel.cart;
    this.tallyCartTotals();
  })

  public tallyCartTotals = () => {
    this.total = this.cart.reduce((acc, item) => acc + (item.product?.price || 0) * item.qty, 0);
    this.discount = this.cart.reduce((acc, item) => acc + (item.product?.discount / 100 || 0) * item.product.price, 0);
    this.totalWithDiscount = Number(
      ((this.total - this.discount) as number).toFixed(2)
    );

    ;
    this.cartTotalEvent.emit(this.totalWithDiscount);

    console.log('Total:', this.total);
    console.log('Discount:', this.discount);
    console.log('Total with Discount:', this.totalWithDiscount);
  }
}
