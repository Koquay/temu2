import { inject, Injectable, signal } from '@angular/core';
import { ProductOptions } from '../product-options';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ProductModel } from '../product.model';
import { catchError, tap } from 'rxjs';
import { getScrollPos } from '../../shared/utils/getScrollPos';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ProductGalleryService {
  public productSignal = signal<{
    products: ProductModel[];
    productCount: number;
  }>({ products: [], productCount: 0 });
  public uniqueColorsSignal = signal<string[]>([]);
  public productOptionsSignal = signal<ProductOptions>(new ProductOptions(''));
  private httpClient = inject(HttpClient);
  private apiUrl = '/api/product';
  private toastr = inject(ToastrService)


  public getProducts = (category: string = "") => {
    this.productOptionsSignal.set({
      ...this.productOptionsSignal(), category
    })
    const optionsStr = JSON.stringify(this.productOptionsSignal())

    const params = new HttpParams({
      fromObject: { options: optionsStr },
    });

    return this.httpClient.get<{ products: ProductModel[]; productCount: number }>(this.apiUrl, { params }).pipe(
      tap((productData) => {
        console.log('productData', productData);
        this.productSignal.set({ ...productData });
        console.log('ProductService.productSignal', this.productSignal())
        // this.productCount = this.productSignal().productCount;
        this.getUniqueColors(productData.products);
      }),
      catchError(error => {
        console.log('error', error)
        this.toastr.error(error.message, 'Save Cart to Server',
          { positionClass: getScrollPos() });
        throw error;
      })
    ).subscribe()
  }

  public setSubcategoryId = (subcategoryId: string) => {
    console.log("ProductGalleryService.setSubcategoryId", subcategoryId)
    this.productOptionsSignal.set({
      ...this.productOptionsSignal(), subcategory: subcategoryId
    })
  }

  public setProductOptionsPageNo = (pageNo: number) => {
    // console.log("ProductGalleryService.setSubcategoryId", subcategoryId)
    this.productOptionsSignal.set({
      ...this.productOptionsSignal(), pageNo: pageNo
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
      const products = this.productSignal().products;

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
    console.log('resetOptions.productOptionSignal before', this.productOptionsSignal());
    this.productOptionsSignal.set(new ProductOptions(''));
    console.log('resetOptions.productOptionSignal after', this.productOptionsSignal());
    this.getProducts();
  }

  public setOptions = (productOptions: ProductOptions) => {
    console.log("ProductGalleryService.setOptions called", productOptions)
    this.productOptionsSignal.set(productOptions);
  }


}
