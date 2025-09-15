import { HttpClient } from '@angular/common/http';
import { effect, inject, Injectable, signal, untracked } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { ProductCategoryModel } from './product-category.model';
import { persistStateToLocalStorage } from '../../shared/utils/localStorageUtils';
import { AppService } from '../../app.service';
import { getScrollPos } from '../../shared/utils/getScrollPos';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ProductCategoryService {
  public productCategorySignal = signal<ProductCategoryModel[]>([]);
  private httpClient = inject(HttpClient);
  public appService = inject(AppService)
  private toastr = inject(ToastrService)

  private appEffect = effect(() => {
    const appState = this.appService?.appSignal(); // this is tracked
    const category = appState.temu.category;

    untracked(() => {
      if (category) {
        this.productCategorySignal.set([...category])
      }

      console.log('cartSignal.cartItems', this.productCategorySignal())

    });
  });

  public getProductCategory = () => {
    this.httpClient.get<ProductCategoryModel[]>('/api/product/1/category').pipe(
      tap(category => {
        this.productCategorySignal.set([...category]);
        console.log("productCategorySignal", this.productCategorySignal())
        persistStateToLocalStorage({ category: this.productCategorySignal() })
      }),
      catchError(error => {
        console.log('error', error)
        this.toastr.error(error.message, 'Save Cart to Server',
          { positionClass: getScrollPos() });
        throw error;
      })
    ).subscribe()

  }

  public getCategory = (categoryId: string) => {
    const category = this.productCategorySignal().find(cat => cat._id === categoryId);
    console.log('getProductSubCategories', category)
    return of(category);
  }
}
