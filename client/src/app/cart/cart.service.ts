import { effect, inject, Injectable, signal } from '@angular/core';
import { CartItem } from './cart.item';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../app.service';
import { saveStateToLocalStorage } from '../shared/utils/localStorageUtils';
import { getScrollPos } from '../shared/utils/getScrollPos';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  public cartSignal = signal<CartItem[]>([]);
  private toastr = inject(ToastrService)
  public appService = inject(AppService)
  private httpClient = inject(HttpClient)
  private cartUrl = '/api/cart';

  public addItemToCart = (cartItem: CartItem) => {
    const existingItem = this.cartSignal().find(item => (item.product?._id === cartItem.product?._id &&
      item.name === cartItem.name &&
      item.size === cartItem.size &&
      item.qty === cartItem.qty)
    )

    if (existingItem) {
      this.toastr.info("Product already in cart.", 'CART',
        { positionClass: getScrollPos() });
      return;
    } else {
      //Remove item if it already exists with different qty
      const newCart = this.cartSignal().filter(item =>
        !(
          item.product?._id === cartItem.product?._id &&
          item.name === cartItem.name &&
          item.size === cartItem.size
        )
      );
      this.cartSignal.set([...newCart, cartItem]);
      console.log('CartService.cartSignal()', this.cartSignal());
      this.toastr.success("Product added to cart.", 'CART',
        { positionClass: getScrollPos() });
      this.saveCart(newCart);
    }
  }

  public deleteItem = (cartItem: CartItem) => {

    const newCart = this.cartSignal().filter(item =>
      !(
        item.product?._id === cartItem.product?._id &&
        item.name === cartItem.name &&
        item.size === cartItem.size
      )
    );

    this.cartSignal.set(newCart);
    this.saveCart(newCart);

    this.toastr.success("Product deleted from cart.", 'CART',
      { positionClass: getScrollPos() });
  }


  public updateItemQty = (cartItem: CartItem) => {
    const newCart = this.cartSignal().map(item => {
      if (
        item.product?._id === cartItem.product?._id &&
        item.name === cartItem.name &&
        item.size === cartItem.size
      ) {
        return { ...item, qty: cartItem.qty };
      }
      return item;
    });

    this.cartSignal.set(newCart);
    this.saveCart(newCart);
  }

  public getUserCart = () => {
    this.httpClient.get<CartItem[]>(this.cartUrl).pipe(
      tap((cart) => {
        console.log('cart', cart);
        this.cartSignal.set([...cart]);
        console.log('ProductService.cartSignal', this.cartSignal())
      }),
    ).subscribe()
  }

  public saveCartToSignal = (cart: CartItem[]) => {
    this.cartSignal.set([...cart]);
    console.log('ProductService.cartSignal', this.cartSignal())
  }

  public mergeCarts(guestCart: CartItem[], userCart: CartItem[]): CartItem[] {
    const map = new Map<string, CartItem>();

    [...userCart, ...guestCart].forEach(item => {
      const key = `${item.product._id}-${item.size}-${item.name}`;
      if (map.has(key)) {
        map.get(key)!.qty += item.qty;  // merge qty
      } else {
        map.set(key, { ...item });
      }
    });

    return Array.from(map.values());
  }


  public saveCartToServer = () => {
    this.httpClient.post(this.cartUrl, this.cartSignal()).pipe(
      tap(() => {
        console.log('Cart saved to server');
      }),
      catchError(error => {
        console.log('error', error)
        this.toastr.error(error.message, 'Save Cart to Server',
          { positionClass: getScrollPos() });
        throw error;
      })
    ).subscribe()
  }

  public saveCart = (cart: CartItem[]) => {
    if (!this.getUserToken()) {
      saveStateToLocalStorage({ cart })
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
