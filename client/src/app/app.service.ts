import { inject, Injectable, signal } from '@angular/core';
import { ProductCategoryModel } from './product/product-category/product-category.model';
import { CartItem } from './cart/cart.item';
import { AuthModel } from './shared/components/auth-modal/auth.model';
import { CheckoutModel } from './checkout/checkout.model';


import { jwtDecode } from "jwt-decode";
import { persistStateToLocalStorage } from './shared/utils/localStorageUtils';
import { CartService } from './cart/cart.service';
import { AuthService } from './shared/components/auth-modal/auth.service';
import { CartModel } from './cart/cart.model';

interface JwtPayload { exp?: number }

export interface localStorageData {
  temu: { category: ProductCategoryModel[] }
}

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private authService = inject(AuthService);

  public appSignal = signal<{
    temu: { category: ProductCategoryModel[]; cartModel: CartModel; auth: AuthModel; checkoutData: CheckoutModel }
  }>({ temu: { category: [], cartModel: new CartModel(), auth: {}, checkoutData: new CheckoutModel() } })

  private cartService = inject(CartService);

  public restoreStateFromLocalStorage = () => {
    const stored = localStorage.getItem("temu");
    const temu = stored ? JSON.parse(stored) : null;

    if (temu?.auth?.token) {
      this.cartService.getUserCartFromServer(temu?.auth?._id).subscribe(cartModel => {
        cartModel.cart = this.cartService.mergeCarts(cartModel.cart);
        this.cartService.cartSignal.set({ cartModel });
      });
    }
    else if (temu?.cartModel?.cart?.length) {
      console.log('restoreStateFromLocalStorage: restoring cart from localStorage', temu.cartModel);
      this.cartService.updateCartSignal(temu.cartModel);
    }

    this.appSignal.set({
      temu: {
        category: temu?.category ?? [],
        cartModel: temu?.cartModel
          ? Object.assign(new CartModel(), temu.cartModel)
          : new CartModel(),
        auth: temu?.auth
          ? Object.assign(new AuthModel(), temu.auth)
          : new AuthModel(),
        checkoutData: temu?.checkoutData
          ? Object.assign(new CheckoutModel(), temu.checkoutData)
          : new CheckoutModel()
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
