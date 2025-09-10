import { effect, inject, Injectable, signal } from '@angular/core';
import { CartItem } from './cart.item';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../app.service';
import { getGuestCart, saveStateToLocalStorage } from '../shared/utils/localStorageUtils';
import { getScrollPos } from '../shared/utils/getScrollPos';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs';
import { CartModel } from './cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  public cartSignal = signal<{ cartModel: CartModel }>({ cartModel: { user: '', cart: [] } });

  private toastr = inject(ToastrService)
  public appService = inject(AppService)
  private httpClient = inject(HttpClient)
  private cartUrl = '/api/cart';

  public addItemToCart = (cartItem: CartItem) => {
    let updatedCart: CartItem[];

    const existingItemIndeX = this.cartSignal().cartModel.cart.findIndex(item =>
      item.product?._id === cartItem.product?._id &&
      item.name === cartItem.name &&
      item.size === cartItem.size
    );

    if (existingItemIndeX >= 0) {
      // Update existing item qty
      updatedCart = [...this.cartSignal().cartModel.cart];
      updatedCart[existingItemIndeX] = {
        ...updatedCart[existingItemIndeX],
        qty: updatedCart[existingItemIndeX].qty + cartItem.qty
      };
    } else {
      // Add new item
      updatedCart = [...this.cartSignal().cartModel.cart, cartItem];
    }

    if (!this.getUserToken()) {
      updatedCart = this.mergeLocalStorageCart(updatedCart);
    }

    let newCartModel: CartModel = { ...this.cartSignal().cartModel, cart: updatedCart };

    this.cartSignal.set({ cartModel: newCartModel });
    this.saveCart(newCartModel);

    this.toastr.success("Product added to cart.", 'CART',
      { positionClass: getScrollPos() });
  };


  public deleteItem = (cartItem: CartItem) => {

    const newCart = this.cartSignal().cartModel.cart.filter(item =>
      !(
        item.product?._id === cartItem.product?._id &&
        item.name === cartItem.name &&
        item.size === cartItem.size
      )
    );

    let newCartModel: CartModel = { ...this.cartSignal().cartModel, cart: newCart };

    this.cartSignal.set({ cartModel: newCartModel });
    this.saveCart(newCartModel);

    this.toastr.success("Product deleted from cart.", 'CART',
      { positionClass: getScrollPos() });
  }


  public updateItemQty = (cartItem: CartItem) => {
    const newCart = this.cartSignal().cartModel.cart.map(item => {
      if (
        item.product?._id === cartItem.product?._id &&
        item.name === cartItem.name &&
        item.size === cartItem.size
      ) {
        return { ...item, qty: cartItem.qty };
      }
      return item;
    });

    let newCartModel: CartModel = { ...this.cartSignal().cartModel, cart: newCart };

    this.cartSignal.set({ cartModel: newCartModel });
    this.saveCart(newCartModel)
  }

  public getUserCartFromServer = () => {
    this.httpClient.get<CartModel>(this.cartUrl).pipe(
      tap((cartModel) => {
        this.cartSignal.set({ cartModel });
        console.log('cartModel', cartModel);
        console.log('ProductService.cartSignal', this.cartSignal())
      }),
      catchError(error => {
        console.log('error', error)
        this.toastr.error(error.message, 'Get Cart From Server',
          { positionClass: getScrollPos() });
        throw error;
      })
    ).subscribe()
  }

  public saveCartToSignal = (cartModel: CartModel) => {
    this.cartSignal.set({ cartModel });
    console.log('ProductService.cartSignal', this.cartSignal())
  }

  public mergeCarts(userCart: CartItem[]): CartItem[] {
    const map = new Map<string, CartItem>();

    [...userCart, ...getGuestCart()].forEach(item => {
      const key = `${item.product._id}-${item.size}-${item.name}`;
      if (map.has(key)) {
        map.get(key)!.qty += item.qty;  // merge qty
      } else {
        map.set(key, { ...item });
      }
    });

    return Array.from(map.values());
  }

  public mergeLocalStorageCart(cart: CartItem[]): CartItem[] {
    const map = new Map<string, CartItem>();

    cart.forEach(item => {
      const key = `${item.product._id}-${item.size}-${item.name}`;
      if (map.has(key)) {
        map.get(key)!.qty += item.qty;
      } else {
        map.set(key, { ...item });
      }
    });

    return Array.from(map.values());
  }


  public removeCartFromLocalStorage = () => {
    let temu: any = {};
    try {
      temu = JSON.parse(localStorage.getItem('temu') || '{}');
      delete temu.cart;
      localStorage.setItem('temu', JSON.stringify(temu)); // update temu without cart
    } catch {
      temu = {};
    }


  }


  public saveCartToServer = () => {
    this.httpClient.post(this.cartUrl, this.cartSignal().cartModel).pipe(
      tap(() => {
        console.log('Cart saved to server');
      }),
      catchError(error => {
        console.log('error', error)
        this.toastr.error(error.error, 'Save Cart to Server',
          { positionClass: getScrollPos() });
        throw error;
      })
    ).subscribe()
  }

  public saveCart = (cartModel: CartModel) => {
    console.log('CartService.saveCart.cart', cartModel.cart)
    if (!this.getUserToken()) {
      saveStateToLocalStorage({ cartModel: cartModel });
      console.log("SAVED CART TO LOCALSTORAGE!")
    } else {
      this.saveCartToServer();
      console.log("SAVED CART TO SERVER!")
    }

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
}
