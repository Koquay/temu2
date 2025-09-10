import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ProductModel } from '../product.model';
import { catchError, tap } from 'rxjs';
import { getScrollPos } from '../../shared/utils/getScrollPos';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ProductSearchService {
  public productSignal = signal<ProductModel[]>([]);
  private searchUrl = '/api/product/search/1';
  private router = inject(Router);
  private httpClient = inject(HttpClient);
  private toastr = inject(ToastrService)

  public searchForProducts = (searchField: string) => {

    const params = new HttpParams({
      fromObject: { searchField },
    });

    return this.httpClient.get<ProductModel[]>(this.searchUrl, { params }).pipe(
      tap(products => {
        console.log('ProductSearchService.products', products)
        this.productSignal.set([...products]);
        console.log('ProductSearchService.productSignal', this.productSignal())
        this.router.navigate(['/product-search']);
      }),
      catchError(error => {
        console.log('error', error)
        this.toastr.error(error.message, 'Save Cart to Server',
          { positionClass: getScrollPos() });
        throw error;
      })
    ).subscribe()
  }
}
