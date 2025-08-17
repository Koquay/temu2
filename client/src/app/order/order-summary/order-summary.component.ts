import { Component, effect, inject } from '@angular/core';
import { CartService } from '../../cart/cart.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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
  public cart = this.cartService.cartSignal()
  public totalWithDiscount = 0;
  public total = 0;
  public discount = 0;

  cartEffect = effect(() => {
    this.cart = this.cartService.cartSignal();
    this.tallyCartTotals();
  })

  public tallyCartTotals = () => {
    this.total = this.cart.reduce((acc, item) => acc + (item.product?.price || 0) * item.qty, 0);
    this.discount = this.cart.reduce((acc, item) => acc + (item.product?.discount / 100 || 0) * item.product.price, 0);
    this.totalWithDiscount = this.total - this.discount;

    console.log('Total:', this.total);
    console.log('Discount:', this.discount);
    console.log('Total with Discount:', this.totalWithDiscount);
  }
}
