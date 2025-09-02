import { effect, inject, Injectable, signal, untracked } from '@angular/core';
import { CartItem } from './cart.item';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../app.service';
import { saveStateToLocalStorage } from '../shared/utils/localStorageUtils';
import { getScrollPos } from '../shared/utils/getScrollPos';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  public cartSignal = signal<CartItem[]>([]);
  private toastr = inject(ToastrService)
  public appService = inject(AppService)
  private httpClient = inject(HttpClient)
  private cartUrl = '/api/cart';

  // private appEffect = effect(() => {
  //   const appState = this.appService.appSignal(); // this is tracked
  //   const cart = appState.temu.cart;

  //   console.log('cart from localStorage', cart)

  //   untracked(() => {
  //     if (cart) {
  //       this.cartSignal.set([...cart])
  //     }

  //     console.log('cartSignal.cartItems', this.cartSignal())

  //   });
  // });


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
      saveStateToLocalStorage({ cart: this.cartSignal() })
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
    saveStateToLocalStorage({ cart: this.cartSignal() })

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
    saveStateToLocalStorage({ cart: this.cartSignal() })
  }

  public getUserCart = () => {
    this.httpClient.get<CartItem[]>(this.cartUrl).pipe(
      tap((cart) => {
        console.log('cart', cart);
        this.cartSignal.set({ ...cart });
        console.log('ProductService.cartSignal', this.cartSignal())
      }),
    ).subscribe()
  }

  public setCart = (cart: CartItem[]) => {
    this.cartSignal.set([...cart]);
    console.log('ProductService.cartSignal', this.cartSignal())
    saveStateToLocalStorage({ cart: this.cartSignal() })
  }


}
