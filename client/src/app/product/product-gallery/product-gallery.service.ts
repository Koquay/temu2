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
  public uniqueColorsSignal = signal<string[]>([]);
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
        this.getUniqueColors(products);
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

  private getUniqueColors = (products: ProductModel[]) => {
    // collect all colors from all products
    const allColors = products.flatMap(product =>
      product.colors.map(color => color.name)
    );

    // deduplicate using a Set
    const uniqueColors = Array.from(new Set(allColors));

    // update the signal
    this.uniqueColorsSignal.set(uniqueColors);

    console.log('ProductGalleryService.uniqueColors', this.uniqueColorsSignal());

    const filterColor = this.productOptionsSignal().color;

    if (filterColor) {
      const products = this.productSignal();

      products.map(product => {
        const currentColor = product.colors.find(color => color.name === filterColor);
        const currentImg = currentColor?.img;

        const tmpImgs = product.images.filter(img => img !== currentImg);
        tmpImgs.unshift(currentImg as string);

        product.images = tmpImgs;
      })
    }
  }

  public resetOptions = () => {
    console.log("ProductGalleryService.resetOptions called")
    this.productOptionsSignal.set(new ProductOptions(''));
    this.getProducts();
  }

  public setOptions = (productOptions: ProductOptions) => {
    console.log("ProductGalleryService.setOptions called", productOptions)
    this.productOptionsSignal.set(productOptions);
  }

}
