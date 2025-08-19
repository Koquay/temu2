import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckoutModel } from './checkout.model';
import { CartItem } from '../cart/cart.item';
import { CartService } from '../cart/cart.service';
import { CheckoutService } from './checkout.service';
import { CommonModule } from '@angular/common';
import { OrderSummaryComponent } from '../order/order-summary/order-summary.component';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    OrderSummaryComponent
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {
  public checkoutSignal = signal<CheckoutModel>(new CheckoutModel());
  private cartService = inject(CartService);
  private checkoutService = inject(CheckoutService);
  public cart: CartItem[] = [];
  public checkoutData: CheckoutModel = new CheckoutModel();

  paymentMethod = {
    paymentType: 'Credit Card',
    cardNumber: '',
    expMonth: null,
    expYear: null,
    CVV: '',
    defaultCreditCard: true,
  };

  checkoutEffect = effect(() => {
    this.checkoutData = this.checkoutService.checkoutSignal();
  })

  cartEffect = effect(() => {
    this.checkoutData.cart = this.cartService.cartSignal();
  })

  expirationMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  expirationYears = [
    "2024",
    "2025",
    "2026",
    "2027",
    "2028",
    "2029",
    "2030",
    "2031",
    "2032",
    "2033",
    "2034",
  ]

  public saveCheckoutData = () => {
    console.log('CheckoutComponent.checkoutData', this.checkoutData)
    // this.checkoutData.paymentMethod.cardNumber = '';
    // this.checkoutData.paymentMethod.expMonth = null;
    // this.checkoutData.paymentMethod.expYear = null;
    // this.checkoutData.paymentMethod.CVV = '';

    this.checkoutService.saveCheckoutData(this.checkoutData)
  }

  public placeOrder = () => {
    console.log('checkoutData', this.checkoutData)
    this.checkoutData.paymentMethod = this.paymentMethod;
    this.checkoutService.placeOrder();
  }


}
