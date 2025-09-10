import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs';
import { ProductModel } from '../product.model';
import { getScrollPos } from '../../shared/utils/getScrollPos';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ProductViewService {
  private httpClient = inject(HttpClient);
  private url = '/api/product';
  private toastr = inject(ToastrService)

  public getSelectedProduct = (productId: string) => {
    return this.httpClient.get<ProductModel>(`${this.url}/${productId}`).pipe(
      tap(product => {
        console.log('ProductViewService.product', product)
      }),
      catchError(error => {
        console.log('error', error)
        this.toastr.error(error.message, 'Save Cart to Server',
          { positionClass: getScrollPos() });
        throw error;
      })
    )
  }
}
