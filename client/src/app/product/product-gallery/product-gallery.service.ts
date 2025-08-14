import { inject, Injectable, signal } from '@angular/core';
import { ProductOptions } from '../product-options';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ProductModel } from '../product.model';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductGalleryService {
  public productSignal = signal<ProductModel[]>([]);
  public productOptionsSignal = signal<ProductOptions>(new ProductOptions(''));
  private httpClient = inject(HttpClient);
  private apiUrl = '/api/product';

  public getProducts = (category: string = "") => {
    this.productOptionsSignal.set({
      ...this.productOptionsSignal(), category
    })
    const optionsStr = JSON.stringify(this.productOptionsSignal())

    const params = new HttpParams({
      fromObject: { options: optionsStr },
    });

    return this.httpClient.get<ProductModel[]>(this.apiUrl, { params }).pipe(
      tap(products => {
        console.log('ProductGalleryService.products', products)
        this.productSignal.set([...products]);
        console.log('ProductGalleryService.productSignal', this.productSignal())

      })
    ).subscribe()
  }

  public setSubcategoryId = (subcategoryId: string) => {
    console.log("ProductGalleryService.setSubcategoryId", subcategoryId)
    this.productOptionsSignal.set({
      ...this.productOptionsSignal(), subcategory: subcategoryId
    })
  }

  public resetCategory = () => {
    console.log("ProductGalleryService.resetCategory")
    this.productOptionsSignal.set(new ProductOptions(''))
  }
}
