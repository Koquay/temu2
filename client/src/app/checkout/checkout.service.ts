import { effect, inject, Injectable, signal, untracked } from '@angular/core';
import { CheckoutModel } from './checkout.model';
import { persistStateToLocalStorage } from '../shared/utils/localStorageUtils';
import { AppService } from '../app.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { catchError, tap } from 'rxjs';
// import { CartService } from '../cart/cart.service';
import { getScrollPos } from '../shared/utils/getScrollPos';
import { CartService } from '../cart/cart.service';
import { OrderConfirmationService } from '../order/order-confirmation/order-confirmation.service';
import { Router } from '@angular/router';
import { OrderModel } from '../order/order-confirmation/order.model';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  public checkoutSignal = signal<CheckoutModel>(new CheckoutModel());
  private cartService = inject(CartService);
  private appService = inject(AppService)
  private httpClient = inject(HttpClient);
  private toastr = inject(ToastrService)
  private url = '/api/order';
  private paymentIntentUrl = '/api/payment/payment-intent';
  private orderConfirmationService = inject(OrderConfirmationService)
  private router = inject(Router);

  private appEffect = effect(() => {
    let checkoutData: CheckoutModel = this.appService?.appSignal().temu.checkoutData;

    untracked(() => {
      this.checkoutSignal.set({ ...checkoutData })
    });

  });

  public saveCheckoutData = (checkoutData: CheckoutModel) => {
    this.checkoutSignal.set({ ...checkoutData })
    persistStateToLocalStorage({ checkoutData: this.checkoutSignal() })
  }

  public placeOrder = () => {
    this.checkoutSignal.set({ ...this.checkoutSignal(), cart: this.cartService.cartSignal().cartModel.cart })
    console.log('PlaceOrder.checkoutSignal', this.checkoutSignal())

    const orderData = this.checkoutSignal();
    orderData.user = this.cartService.cartSignal().cartModel.user;

    this.httpClient.post<OrderModel>(this.url, { orderData: this.checkoutSignal() }).pipe(
      tap(order => {
        console.log('new order', order)
        this.toastr.success('Order successfully placed.', 'Place Order',
          { positionClass: getScrollPos() })

        this.orderConfirmationService.saveOrder(order);
        this.router.navigate(['/order-confirmation']);
      }),
      catchError(error => {
        console.log('error', error)
        this.toastr.error(error.message, 'Place Order',
          { positionClass: getScrollPos() });
        throw error;
      })
    ).subscribe()

  }

  public createPaymentIntent = (paymentInfo: { amount: number, currency: string }) => {
    console.log('PlaceOrder.checkoutSignal', this.checkoutSignal())

    return this.httpClient.post(this.paymentIntentUrl, paymentInfo).pipe(
      tap(paymentIntent => {
        console.log('new paymentIntent', paymentIntent)
        this.toastr.success('Payment intent established', 'Payment Intent',
          { positionClass: getScrollPos() })
      }),
      catchError(error => {
        console.log('error', error)
        this.toastr.error(error.message, 'Payment Intent',
          { positionClass: getScrollPos() });
        throw error;
      })
    )

  }

}
