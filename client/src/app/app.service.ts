import { inject, Injectable, signal } from '@angular/core';
import { ProductCategoryModel } from './product/product-category/product-category.model';
import { CartItem } from './cart/cart.item';
import { AuthModel } from './shared/components/auth-modal/auth.model';
import { CheckoutModel } from './checkout/checkout.model';


import { jwtDecode } from "jwt-decode";
import { saveStateToLocalStorage } from './shared/utils/localStorageUtils';
import { CartService } from './cart/cart.service';

interface JwtPayload { exp?: number }

export interface localStorageData {
  temu: { category: ProductCategoryModel[] }
}

@Injectable({
  providedIn: 'root'
})
export class AppService {
  public appSignal = signal<{
    temu: { category: ProductCategoryModel[]; cart: CartItem[]; auth: AuthModel; checkoutData: CheckoutModel }
  }>({ temu: { category: [], cart: [], auth: {}, checkoutData: new CheckoutModel() } })

  private cartService = inject(CartService);


  public restoreStateFromLocalStorage = () => {
    const stored = localStorage.getItem("temu");
    const temu = stored ? JSON.parse(stored) : null;

    if (temu?.auth?.token && this.isTokenExpired(temu.auth.token)) {
      console.log('Token is expired, removing auth data from local storage.');
      saveStateToLocalStorage({ auth: {} })
    } else if (temu?.auth?.token) {
      this.cartService.getUserCart();
    }

    this.appSignal.set({
      temu: {
        category: temu?.category ?? [],
        cart: temu?.cart ?? [],
        auth: temu?.auth ?? {},
        checkoutData: Object.assign(new CheckoutModel(), temu?.checkoutData ?? {})
      }
    });
  };


  private isTokenExpired = (token: string) => {
    const { exp } = jwtDecode<JwtPayload>(token);

    console.log('Token expiration time (exp):', exp);

    if (!exp) {
      return true;
    }
    return Date.now() >= exp * 1000;
  }



}
