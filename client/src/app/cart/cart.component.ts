import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DiscountPricePipe } from '../shared/pipes/discount-price.pipe';
import { CartItem } from './cart.item';
import { CartService } from './cart.service';
import { OrderSummaryComponent } from '../order/order-summary/order-summary.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    CommonModule,
    DiscountPricePipe,
    OrderSummaryComponent
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  public cart: CartItem[] = [];
  private cartService = inject(CartService);
  public qtyList = Array.from({ length: 10 }, (_, i) => i + 1);

  ngOnInit() {
    window.scrollTo(0, 0);
  }

  cartEffect = effect(() => {
    this.cart = this.cartService.cartSignal();
    console.log('CartComponent.cart', this.cart);
  })

  public deleteItem = (cartItem: CartItem) => {
    this.cartService.deleteItem(cartItem);
  }

  public updateItemQty = (cartItem: CartItem, qty: number) => {
    this.cartService.updateItemQty(cartItem);
  }
}
