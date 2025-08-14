import { Injectable, signal } from '@angular/core';
import { ProductCategoryModel } from './product/product-category/product-category.model';

export interface localStorageData {
  temu: { category: ProductCategoryModel[] }
}

@Injectable({
  providedIn: 'root'
})
export class AppService {
  public appSignal = signal<{
    temu: { category: ProductCategoryModel[]; }
  }>({ temu: { category: [], } })

  public restoreStateFromLocalStorage = () => {
    const temu = JSON.parse(localStorage.getItem("temu") as string);
    this.appSignal.set({ temu: { ...temu } })
    console.log('appService.appSignal', this.appSignal())
    console.log('this.appService.appSignal().temu.category', this.appSignal().temu.category)
  }
}
