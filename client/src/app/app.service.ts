import { Injectable, signal } from '@angular/core';
import { ProductCategoryModel } from './product/product-category/product-category.model';
import { CartItem } from './cart/cart.item';
import { AuthModel } from './shared/components/auth-modal/auth.model';
import { CheckoutModel } from './checkout/checkout.model';

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


  public restoreStateFromLocalStorage = () => {
    const stored = localStorage.getItem("temu");
    const temu = stored ? JSON.parse(stored) : null;

    this.appSignal.set({
      temu: {
        category: temu?.category ?? [],
        cart: temu?.cart ?? [],
        auth: temu?.auth ?? {},
        checkoutData: Object.assign(new CheckoutModel(), temu?.checkoutData ?? {})
      }
    });
  };


}
