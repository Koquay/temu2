import { effect, inject, Injectable, signal, untracked } from '@angular/core';
import { CheckoutModel } from './checkout.model';
import { saveStateToLocalStorage } from '../shared/utils/localStorageUtils';
import { AppService } from '../app.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { catchError, tap } from 'rxjs';
import { CartService } from '../cart/cart.service';

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

  private appEffect = effect(() => {
    let checkoutData: CheckoutModel = this.appService.appSignal().temu.checkoutData;

    untracked(() => {
      this.checkoutSignal.set({ ...checkoutData })
    });

  });

  public saveCheckoutData = (checkoutData: CheckoutModel) => {
    this.checkoutSignal.set({ ...checkoutData })
    saveStateToLocalStorage({ checkoutData: this.checkoutSignal() })
  }

  public placeOrder = () => {
    this.checkoutSignal.set({ ...this.checkoutSignal(), cart: this.cartService.cartSignal() })
    console.log('PlaceOrder.checkoutSignal', this.checkoutSignal())

    this.httpClient.post(this.url, { orderData: this.checkoutSignal() }).pipe(
      tap(order => {
        console.log('new order', order)
        this.toastr.success('Order successfully placed.', 'Place Order')
      }),
      catchError(error => {
        console.log('error', error)
        this.toastr.error(error.message, 'Place Order');
        throw error;
      })
    ).subscribe()

  }
}
