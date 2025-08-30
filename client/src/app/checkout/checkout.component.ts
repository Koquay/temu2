import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckoutModel } from './checkout.model';
import { CartItem } from '../cart/cart.item';
import { CartService } from '../cart/cart.service';
import { CheckoutService } from './checkout.service';
import { CommonModule } from '@angular/common';
import { OrderSummaryComponent } from '../order/order-summary/order-summary.component';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';



@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    OrderSummaryComponent,
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {
  public checkoutSignal = signal<CheckoutModel>(new CheckoutModel());
  private cartService = inject(CartService);
  private checkoutService = inject(CheckoutService);
  private toastr = inject(ToastrService);
  public cart: CartItem[] = [];
  public checkoutData: CheckoutModel = new CheckoutModel();
  stripe: Stripe | null = null;
  cardElement: any;
  card: any;
  elements: any;
  clientSecret: string = "";
  private cartTotal: number = 0;
  public billingPostalCode: string = '';

  checkoutEffect = effect(() => {
    this.checkoutData = this.checkoutService.checkoutSignal();
  })

  cartEffect = effect(() => {
    this.checkoutData.cart = this.cartService.cartSignal();
  })


  ngOnInit() {
    this.setUpStripe();
  }


  onPaymentTypeChange(): void {
    if (this.checkoutData.paymentType === 'PayPal') {
      // setTimeout(() => this.renderPaypalButton(), 0);
    } else if (this.checkoutData.paymentType === 'CreditCard') {
      setTimeout(() => this.setUpStripe(), 0);
    }
  }



  public saveCheckoutData = () => {
    console.log('CheckoutComponent.checkoutData', this.checkoutData)
    this.checkoutService.saveCheckoutData(this.checkoutData)
  }

  public setUpStripe = async () => {
    this.stripe = await loadStripe(environment.pk_test);

    if (this.stripe) {
      this.elements = this.stripe.elements();

      this.card = this.elements.create('card', {
        hidePostalCode: true
      });
      this.card.mount('#card-element');

    }

    this.checkoutService.createPaymentIntent({ amount: this.cartTotal, currency: 'usd' }).subscribe((paymentIntent => {
      for (const [key, value] of Object.entries(paymentIntent)) {
        if (key === 'client_secret') {
          console.log(`${key}: ${value}`);
          this.clientSecret = value as string;
          console.log('clientSecret', this.clientSecret);
        }

      }
    }))
  }

  onPaymentTypeCreditCard() {
    if (this.checkoutData.paymentType === 'CreditCard') {
      setTimeout(() => this.setUpStripe(), 0);
    }
  }

  public placeOrder = async () => {
    if (!this.stripe || !this.clientSecret) {
      this.toastr.error('There may be a problem with your credit card.', 'Error Placing Order',
        { positionClass: this.getScrollPos() }
      );
      return;
    }

    if (!this.getUserToken()) {
      this.toastr.error('You must be logged in to place an order', 'Error Placing Order',
        { positionClass: this.getScrollPos() }
      );
      return;
    }

    const result = await this.stripe.confirmCardPayment(this.clientSecret, {
      payment_method: {
        card: this.card,
        billing_details: {
          address: {
            postal_code: this.billingPostalCode
          }
        }
      },
    });

    if (result.error) {
      this.toastr.error(result.error.message, 'Error Placing Order');
      console.error(result.error.message);
    } else if (result.paymentIntent?.status === 'succeeded') {
      console.log('Payment succeeded!');
      this.checkoutService.placeOrder();
      this.toastr.success('Order successfully placed', 'Order Success');
    }
  }

  public setCartTotal = (total: number) => {
    this.cartTotal = total;
    console.log('CheckoutComponent.cartTotal', this.cartTotal)
  }

  private getUserToken = () => {
    const temu = localStorage.getItem('temu');
    let token = null;

    if (temu) {
      token = JSON.parse(temu)?.auth?.token;
      console.log('authorizationTokenInterceptor token', token)
    }

    return token;
  }



  private getScrollPos = () => {
    const scrollPos = window.scrollY + window.innerHeight / 2;
    const halfway = document.body.scrollHeight / 2;

    const position =
      scrollPos > halfway ? 'toast-top-center' : 'toast-bottom-center';

    return position;
  }

}
