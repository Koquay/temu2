import { effect, inject, Injectable, signal, untracked } from '@angular/core';
import { AuthModel } from './auth.model';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { saveStateToLocalStorage } from '../../utils/localStorageUtils';
import { AppService } from '../../../app.service';
import { getScrollPos } from '../../utils/getScrollPos';
import { CartItem } from '../../../cart/cart.item';
import { CartService } from '../../../cart/cart.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public authSignal = signal<AuthModel>({
    firstName: 'John',
    lastName: 'John',
    email: 'aaaaaa@aaa.com',
    password: 'aaaaaa',
    token: '',
    _id: ''
  });

  private httpClient = inject(HttpClient);
  private url = '/api/auth';
  private toastr = inject(ToastrService);
  public appService = inject(AppService)
  public cartService = inject(CartService)

  private appEffect = effect(() => {
    const appState = this.appService.appSignal(); // this is tracked
    const auth = appState.temu.auth;

    console.log('auth from localStorage', auth)

    untracked(() => {
      if (auth) {
        this.authSignal.set({ ...auth })
      }

      console.log('authSignal.auth', this.authSignal())

    });
  });

  public signIn = (authData: AuthModel) => {
    return this.httpClient.put<{ auth: AuthModel, cart: CartItem[] }>(this.url, authData).pipe(
      tap(userData => {
        this.authSignal.set({ ...userData.auth });
        saveStateToLocalStorage({ auth: this.authSignal() });

        let temu: any = {};
        try {
          temu = JSON.parse(localStorage.getItem('temu') || '{}');
        } catch {
          temu = {};
        }

        const mergedCart = this.cartService.mergeCarts(temu?.cart || [], userData.cart);

        this.cartService.saveCartToSignal(mergedCart);

        if (mergedCart.length > 0) {
          this.cartService.saveCartToServer();
        }

        // this.cartService.saveCartToServer(); // sync DB
        delete temu.cart;
        localStorage.setItem('temu', JSON.stringify(temu)); // update temu without cart
      })
    )
  }

  public signUp = (authData: AuthModel) => {
    console.log('signUp', authData)

    return this.httpClient.post<{ auth: AuthModel, cart: CartItem[] }>(this.url, authData).pipe(
      tap(userData => {
        console.log('userData', userData)
        const authData = userData.auth;
        this.authSignal.set({ ...authData })
        console.log('this.authSignal()', this.authSignal())

        saveStateToLocalStorage({ auth: this.authSignal() })
        this.cartService.saveCartToSignal(userData.cart);
      }),
      catchError(error => {
        console.log('error', error)
        this.toastr.error(error.message, 'Sign Up',
          { positionClass: getScrollPos() });
        throw error;
      })
    )
  }



}
