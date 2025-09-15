import { effect, inject, Injectable, signal } from '@angular/core';
import { CartItem } from './cart.item';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../app.service';
import { getGuestCart, persistStateToLocalStorage } from '../shared/utils/localStorageUtils';
import { getScrollPos } from '../shared/utils/getScrollPos';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable, tap } from 'rxjs';
import { CartModel } from './cart.model';
import { AuthService } from '../shared/components/auth-modal/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  public cartSignal = signal<{ cartModel: CartModel }>({ cartModel: { user: '', cart: [] } });

  private toastr = inject(ToastrService)
  public appService = inject(AppService)
  public authService = inject(AuthService)
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

    console.log('addItemToCart.newCArtModel', newCartModel)
    this.persistCart(newCartModel);

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
    this.removeItemFromLocalStorage(cartItem);

    if (this.getUserToken()) {
      newCartModel.cart = newCartModel.cart.concat(getGuestCart());
      this.cartSignal.set({ cartModel: newCartModel });
      this.persistCart(newCartModel);
    }


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
    this.persistCart(newCartModel)
  }

  public getUserCartFromServer = (user: string): Observable<CartModel> => {

    const params = new HttpParams({
      fromObject: { user },
    });
    return this.httpClient.get<CartModel>(this.cartUrl, { params }).pipe(
      tap((cartModel) => {
        console.log('getUserCartFromServer.cartModel', cartModel);
      }),
      catchError(error => {
        console.log('error', error);
        this.toastr.error(
          error.message || error.error,
          'Get Cart From Server',
          { positionClass: getScrollPos() }
        );
        throw error;
      })
    );
  }


  public updateCartSignal = (cartModel: CartModel) => {
    this.cartSignal.set({ cartModel });
    console.log('ProductService.cartSignal', this.cartSignal())
  }

  public mergeCarts(userCart: CartItem[]): CartItem[] {
    const map = new Map<string, CartItem>();

    const guestCart = getGuestCart();

    // Merge quantities of products of same _id, size and name in both carts;
    [...userCart, ...guestCart].forEach(item => {
      const key = `${item.product._id}-${item.size}-${item.name}`;
      if (map.has(key)) {
        map.get(key)!.qty += item.qty;  // merge qty
      } else {
        map.set(key, { ...item });
      }
    });

    let newCart: CartItem[] = Array.from(map.values());

    // Remove items from local storage that has been merged to user cart
    [...newCart].forEach(item => {
      this.removeItemFromLocalStorage(item);
    })

    // Add remaining items from guest cart that are not in user cart
    newCart = newCart.concat(getGuestCart());

    // Finally, remove cart from local storage
    this.removeCartFromLocalStorage();

    return newCart;
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

    let newCart = Array.from(map.values());

    // Remove items from local storage that has been merged to user cart
    [...newCart].forEach(item => {
      this.removeItemFromLocalStorage(item);
    })

    return newCart;

    // return Array.from(map.values());
  }


  public removeCartFromLocalStorage = () => {
    let temu: any = {};
    try {
      temu = JSON.parse(localStorage.getItem('temu') || '{}');
      delete temu.cartModel;
      localStorage.setItem('temu', JSON.stringify(temu)); // update temu without cart
    } catch (error) {
      throw error
      // temu = {};
    }
  }

  public removeItemFromLocalStorage = (cartItem: CartItem) => {
    let temu: any = {};
    try {
      temu = JSON.parse(localStorage.getItem('temu') || '{}');

      const temuCart: CartItem[] = temu?.cartModel?.cart || [];

      if (temuCart.length) {
        const newCart = temuCart.filter(item =>
          !(
            item.product?._id === cartItem.product?._id &&
            item.name === cartItem.name &&
            item.size === cartItem.size
          )
        );

        temu.cartModel.cart = newCart;
        localStorage.setItem('temu', JSON.stringify(temu)); // update temu without cart
      }

    } catch (error) {
      throw error
      // temu = {};
    }
  }


  public persistCartToServer = (cartModel: CartModel) => {
    console.log('persistCartToServer.CartModel.cart', cartModel.cart)

    this.httpClient.post<CartItem[]>(this.cartUrl, cartModel).pipe(
      tap((cart) => {
        console.log('persistCartToServer persisted cart', cart)
        this.cartSignal.set({ cartModel: { ...this.cartSignal().cartModel, cart } });
        console.log('persistCartToServer persisted cartSignal()', this.cartSignal())
      }),
      catchError(error => {
        console.log('error', error)
        this.toastr.error(error.message || error.error, 'Save Cart to Server',
          { positionClass: getScrollPos() });
        throw error;
      })
    ).subscribe()
  }

  public persistCart = (cartModel: CartModel) => {
    console.log('persistCart.cartModel', cartModel)
    if (!this.getUserToken()) {
      persistStateToLocalStorage({ cartModel: cartModel });
      console.log("SAVED CART TO LOCALSTORAGE!")
    } else {
      this.persistCartToServer(cartModel);
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
