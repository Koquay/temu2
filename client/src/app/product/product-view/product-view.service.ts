import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { ProductModel } from '../product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductViewService {
  private httpClient = inject(HttpClient);
  private url = '/api/product';

  public getSelectedProduct = (productId: string) => {
    return this.httpClient.get<ProductModel>(`${this.url}/${productId}`).pipe(
      tap(product => {
        console.log('ProductViewService.product', product)
      })
    )
  }
}
