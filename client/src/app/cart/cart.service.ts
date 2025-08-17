import { effect, inject, Injectable, signal, untracked } from '@angular/core';
import { CartItem } from './cart.item';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../app.service';
import { saveStateToLocalStorage } from '../shared/utils/localStorageUtils';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  public cartSignal = signal<CartItem[]>([]);
  private toastr = inject(ToastrService)
  public appService = inject(AppService)

  private appEffect = effect(() => {
    const appState = this.appService.appSignal(); // this is tracked
    const cart = appState.temu.cart;

    console.log('cart from localStorage', cart)

    untracked(() => {
      if (cart) {
        this.cartSignal.set([...cart])
      }

      console.log('cartSignal.cartItems', this.cartSignal())

    });
  });


  public addItemToCart = (cartItem: CartItem) => {
    const existingItem = this.cartSignal().find(item => (item.product?._id === cartItem.product?._id &&
      item.name === cartItem.name &&
      item.size === cartItem.size))

    if (existingItem) {
      this.toastr.info("Product already in cart.", 'CART');
    } else {
      this.cartSignal.set([...this.cartSignal(), cartItem]);
      console.log('CartService.cartSignal()', this.cartSignal());
      this.toastr.success("Product added to cart.", 'CART');
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


}
