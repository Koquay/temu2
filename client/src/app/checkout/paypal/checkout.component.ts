import { AfterViewInit, Component, effect, inject, signal } from '@angular/core';
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


const paypal = (window as any).paypal;


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
export class CheckoutComponent implements AfterViewInit {
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

  checkoutEffect = effect(() => {
    this.checkoutData = this.checkoutService.checkoutSignal();
  })

  cartEffect = effect(() => {
    this.checkoutData.cart = this.cartService.cartSignal();
  })


  ngOnInit() {
    this.setUpStripe();
  }

  private paypalRendered = false;

  ngAfterViewInit(): void {
    this.loadPaypalSdk();
  }

  onPaymentTypeChange(): void {
    if (this.checkoutData.paymentType === 'PayPal') {
      setTimeout(() => this.renderPaypalButton(), 0);
    } else if (this.checkoutData.paymentType === 'CreditCard') {
      setTimeout(() => this.setUpStripe(), 0);
    }
  }



  private renderPaypalButton() {
    const paypal = (window as any).paypal;
    if (!paypal) {
      console.error('PayPal SDK not loaded yet');
      return;
    }

    // Clear old buttons if container already exists
    const container = document.getElementById('paypal-button-container');
    if (container) {
      container.innerHTML = '';
    }

    paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{ amount: { value: this.cartTotal } }]
        });
      },
      onApprove: (data: any, actions: any) => {
        return actions.order.capture().then((details: any) => {
          alert(`Transaction completed by ${details.payer.name.given_name}`);
        });
      }
    }).render('#paypal-button-container');
  }


  private loadPaypalSdk(): void {
    if ((window as any).paypal) return; // already loaded
    const script = document.createElement('script');
    script.src = 'https://www.paypal.com/sdk/js?client-id=sb&currency=USD';
    script.onload = () => {
      if (this.checkoutData.paymentType === 'PayPal') {
        this.renderPaypalButton();
        this.paypalRendered = true;
      }
    };
    document.body.appendChild(script);
  }



  public saveCheckoutData = () => {
    console.log('CheckoutComponent.checkoutData', this.checkoutData)
    this.checkoutService.saveCheckoutData(this.checkoutData)
  }

  public placeOrderxxxx = () => {
    console.log('checkoutData', this.checkoutData)
    this.checkoutService.placeOrder();
  }

  public setUpStripe = async () => {
    // this.stripe = await loadStripe('pk_test_51Rzh902Kk9igLGtNlPhBMrAyGOGBzohJelgp4T889aLnrfue1LHSAkYf5owOlwGggXAb3J5z7XS5IvYN9b1DDsP40067yEzYdW');
    this.stripe = await loadStripe(environment.pk_test);

    if (this.stripe) {
      this.elements = this.stripe.elements();
      this.card = this.elements.create('card');
      this.card.mount('#card-element'); // Attach to template
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
    if (!this.stripe || !this.clientSecret) return;

    const result = await this.stripe.confirmCardPayment(this.clientSecret, {
      payment_method: {
        card: this.card,
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

  public payWithPayPal = () => {

  }



}
