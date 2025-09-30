import { effect, inject, Injectable, Injector, signal, untracked } from '@angular/core';
import { AuthModel } from './auth.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Subject, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { persistStateToLocalStorage } from '../../utils/localStorageUtils';
import { AppService } from '../../../app.service';
import { getScrollPos } from '../../utils/getScrollPos';
import { CartItem } from '../../../cart/cart.item';
import { CartModel } from '../../../cart/cart.model';
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
  private signInSuccessSource = new Subject<void>();
  signInSuccess$ = this.signInSuccessSource.asObservable();

  constructor(private injector: Injector) { }

  //Due to issue of circular dependency between AuthService and CartService
  private get cartService() {
    return this.injector.get(CartService);
  }


  emitSignInSuccess() {
    this.signInSuccessSource.next();
  }

  private appEffect = effect(() => {
    const appState = this.appService?.appSignal(); // this is tracked
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
        persistStateToLocalStorage({ auth: this.authSignal() });

        console.log('this.cartService', this.cartService);
        console.log('typeof this.cartService.mergeCarts', typeof this.cartService.mergeCarts);

        const newCartModel = new CartModel();
        newCartModel.user = userData.auth._id as string;
        newCartModel.cart = this.cartService.mergeCarts(userData.cart as CartItem[]);

        this.cartService.updateCartSignal(newCartModel);

        if (newCartModel.cart.length) {
          this.cartService.persistCartToServer(newCartModel);
        }

        this.toastr.success("You are successfully signed in", 'Sign In',
          { positionClass: getScrollPos() });

      }),
      catchError(error => {
        console.log('error', error)
        this.toastr.error(error.message || error.error, 'Sign In',
          { positionClass: getScrollPos() });
        throw error;
      })
    )
  }

  public signUp = (authData: AuthModel) => {
    console.log('signUp', authData)

    return this.httpClient.post<{ auth: AuthModel, cart: CartItem[] }>(this.url, authData).pipe(
      tap(userData => {
        // if (this.authSignal()._id) {
        //   this.signOut();
        // }

        console.log('userData', userData)
        console.log('userData.cart', userData.cart)
        const authData = userData.auth;
        this.authSignal.set({ ...authData })
        console.log('this.authSignal()', this.authSignal())

        persistStateToLocalStorage({ auth: this.authSignal() })

        const newCartModel = new CartModel();
        newCartModel.user = userData.auth._id as string;
        newCartModel.cart = this.cartService.mergeCarts(userData.cart as CartItem[]);

        this.cartService.updateCartSignal(newCartModel);

        if (newCartModel.cart?.length > 0) {
          this.cartService.persistCartToServer(newCartModel);
        }

        this.toastr.success("You are successfully signed up", 'Sign Up',
          { positionClass: getScrollPos() });

      }),
      catchError(error => {
        console.log('error', error)
        this.toastr.error(error.message || error.error, 'Sign Up',
          { positionClass: getScrollPos() });
        throw error;
      })
    )
  }

  public signOut = () => {
    this.httpClient.post('/api/auth/signOut', { userId: this.authSignal()._id }).pipe(
      tap((message) => {
        console.log('Sign out on backend successful', message);

        this.cartService.updateCartSignal(new CartModel());

        let temu: any = {};
        try {
          this.authSignal.set({});
          temu = JSON.parse(localStorage.getItem('temu') || '{}');
          delete temu.auth;
          localStorage.setItem('temu', JSON.stringify(temu));

          this.toastr.success("You have successfully signed out", 'Sign Out',
            { positionClass: getScrollPos() });
        } catch {
          temu = {};
        }
      }),
      catchError(error => {
        console.log('error', error)
        this.toastr.error(error.message || error.error, 'Sign Out',
          { positionClass: getScrollPos() });
        throw error;
      })
    ).subscribe();


  }

  public getVerificationCode = (authData: AuthModel) => {
    const params = new HttpParams({
      fromObject: { authData: JSON.stringify(authData) },
    });
    return this.httpClient.get(this.url + '/verification-code', { params }).pipe(
      tap((verificationCode) => {
        console.log('verificationCode', verificationCode);
      }),
      catchError(error => {
        console.log('error', error);
        this.toastr.error(
          error.message || error.error,
          'GetVerification Code',
          { positionClass: getScrollPos() }
        );
        throw error;
      })
    );
  }

  public changePassword = (authData: AuthModel) => {
    return this.httpClient.put<{ auth: AuthModel, cart: CartItem[] }>(this.url + '/change-password', authData).pipe(
      tap(userData => {
        this.authSignal.set({ ...userData.auth });
        persistStateToLocalStorage({ auth: this.authSignal() });

        const newCartModel = new CartModel();
        newCartModel.user = userData.auth._id as string;
        newCartModel.cart = this.cartService.mergeCarts(userData.cart as CartItem[]);

        this.cartService.updateCartSignal(newCartModel);

        if (newCartModel.cart.length) {
          this.cartService.persistCartToServer(newCartModel);
        }

        this.toastr.success("You are successfully signed in", 'Sign In',
          { positionClass: getScrollPos() });

      }),
      catchError(error => {
        console.log('error', error);
        this.toastr.error(
          error.message || error.error,
          'Change Password',
          { positionClass: getScrollPos() }
        );
        throw error;
      })
    )
  }

}
