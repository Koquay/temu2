import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ProductModel } from '../product.model';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductSearchService {
  public productSignal = signal<ProductModel[]>([]);
  private searchUrl = '/api/product/search/1';
  private router = inject(Router);
  private httpClient = inject(HttpClient);

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
      })
    ).subscribe()
  }
}
