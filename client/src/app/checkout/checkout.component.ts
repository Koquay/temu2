import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckoutModel } from './checkout.model';
import { CheckoutService } from './checkout.service';
import { CommonModule } from '@angular/common';
import { OrderSummaryComponent } from '../order/order-summary/order-summary.component';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';
import { getScrollPos } from '../shared/utils/getScrollPos';
import { AuthService } from '../shared/components/auth-modal/auth.service';
import { Router } from '@angular/router';
import { CartService } from '../cart/cart.service';
import { CartItem } from '../cart/cart.item';
import { PaypalButtonComponent } from '../payment/paypal-button/paypal-button.component';

declare var bootstrap: any;

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    OrderSummaryComponent,
    PaypalButtonComponent
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {
  public checkoutSignal = signal<CheckoutModel>(new CheckoutModel());
  private cartService = inject(CartService);
  private checkoutService = inject(CheckoutService);
  private authService = inject(AuthService);
  private router = inject(Router);

  private toastr = inject(ToastrService);
  public cart: CartItem[] = [];
  public checkoutData: CheckoutModel = new CheckoutModel();
  stripe: Stripe | null = null;
  cardElement: any;
  card: any;
  elements: any;
  clientSecret: string = "";
  private cartTotal: number = 0;
  public billingPostalCode = '';

  constructor() {
    this.authService.signInSuccess$.subscribe(() => {
      this.router.navigate(['/cart']);
    });
  }

  checkoutEffect = effect(() => {
    this.checkoutData = this.checkoutService.checkoutSignal();
  })

  cartEffect = effect(() => {
    this.checkoutData.cart = this.cartService.cartSignal().cartModel.cart;
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
        { positionClass: getScrollPos() }
      );
      return;
    }

    if (!this.getUserToken()) {
      this.toastr.error('You must be signed in to place an order', 'Error Placing Order',
        { positionClass: getScrollPos() }
      );
      this.showSignInModal();
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
      this.toastr.error(result.error.message, 'Error Placing Order',
        { positionClass: getScrollPos() });
      console.error(result.error.message);
    } else if (result.paymentIntent?.status === 'succeeded') {
      console.log('Payment succeeded!');
      this.checkoutService.placeOrder();
      this.toastr.success('Order successfully placed', 'Order Success',
        { positionClass: getScrollPos() });
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

  showSignInModal() {
    console.log('CheckoutComponent.showSignInModal() called')
    const modalElement = document.getElementById('signInModal');
    console.log('CheckoutComponent.modalElement', modalElement)
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
}
