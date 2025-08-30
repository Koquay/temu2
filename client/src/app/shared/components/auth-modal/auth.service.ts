import { effect, inject, Injectable, signal, untracked } from '@angular/core';
import { AuthModel } from './auth.model';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { saveStateToLocalStorage } from '../../utils/localStorageUtils';
import { AppService } from '../../../app.service';
import { getScrollPos } from '../../utils/getScrollPos';

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
    console.log('signIn', authData)

    return this.httpClient.put<AuthModel>(this.url, authData).pipe(
      tap(auth => {
        console.log('auth', auth)
        const authData = auth;
        this.authSignal.set({ ...authData })
        console.log('this.authSignal()', this.authSignal())
        saveStateToLocalStorage({ auth: this.authSignal() })
      }),
      catchError(error => {
        console.log('error', error)
        this.toastr.error(error.message, 'Sign In',
          { positionClass: getScrollPos() });
        throw error;
      })
    )
  }

  public signUp = (authData: AuthModel) => {
    console.log('signUp', authData)

    return this.httpClient.post<AuthModel>(this.url, authData).pipe(
      tap(auth => {
        console.log('auth', auth)
        const authData = auth;
        this.authSignal.set({ ...authData })
        console.log('this.authSignal()', this.authSignal())
        saveStateToLocalStorage({ auth: this.authSignal() })
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
