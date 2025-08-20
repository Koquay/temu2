import { Component, effect, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductGalleryService } from '../../../product/product-gallery/product-gallery.service';
import { ProductModel } from '../../../product/product.model';

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './breadcrumbs.component.html',
  styleUrl: './breadcrumbs.component.scss'
})
export class BreadcrumbsComponent implements OnInit {
  // private selectedProductService = inject(SelectedProductService)
  private router = inject(Router)

  public breadcrumbs = [{ label: '', url: '' }];
  public productName: string = '';
  public productId = '';
  private selectedProduct?: ProductModel;
  private productGalleryService = inject(ProductGalleryService);

  ngOnInit(): void {
    //   this.productGalleryService.selectedProductSubject.subscribe(params => {
    //     this.selectedProduct = params.product;
    //     this.productName = this.selectedProduct?.name.substring(0, 12) + '...';
    //     this.productId = this.selectedProduct?._id;
    //     console.log('Breadcrumb.selectedProduct', this.selectedProduct)
    //   })

    this.buildBreadcrumbs();
  }

  private buildBreadcrumbs = () => {
    this.breadcrumbs.shift();
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        let url = this.router.url;

        let label = url.substring(1); // remove leading '/' from url
        //console.log('url', url);        

        if (label.includes('/')) {
          let index = label.indexOf('/');
          label = label.substring(0, index);
        }

        label = label.replaceAll('-', ' ');

        if (url.startsWith('/selected-product')) {
          label = this.productName || 'Selected Product';
        }

        let breadcrumb = { label, url };

        // if(!url.startsWith('/selected-product')) { 
        this.breadcrumbs = this.breadcrumbs?.filter(
          (breadcrumb: { label: string, url: string }) => breadcrumb.url !== url
        );
        // }

        this.breadcrumbs?.push(breadcrumb);

        console.log('breadcrumbs', this.breadcrumbs);

        //if user refreshes the page, get the breadcrumbs from localStorage
        if (this.breadcrumbs.length === 1) {
          if (breadcrumb.url !== '/home') {
            let state = JSON.parse(localStorage.getItem('temu') as string);
            this.breadcrumbs = state.breadcrumbs;
          }
        }

        // let state = JSON.parse(localStorage.getItem('temu') as string) || {};
        // state.breadcrumbs = this.breadcrumbs;
        // localStorage.setItem('temu', JSON.stringify(state));

        this.saveBreadcrumbsToLocalstorage();
      }
    });
  };

  navigateToUrl = (url: string) => {
    if (url.startsWith('/selected-product')) {
      const productId = url.split('/')[2]
      // this.store.dispatch(StoreSelectedProduct({productId}))
    }

    this.router.navigateByUrl(url);
  }

  public clearBreadcrumbs = () => {
    this.breadcrumbs = [this.breadcrumbs[this.breadcrumbs.length - 1]]
    let breadcrumb = { label: 'Home', url: '/home' }
    this.breadcrumbs.unshift(breadcrumb);
    this.saveBreadcrumbsToLocalstorage();
  }

  private saveBreadcrumbsToLocalstorage = () => {
    let state = JSON.parse(localStorage.getItem('temu') as string) || {};
    state.breadcrumbs = this.breadcrumbs;
    localStorage.setItem('temu', JSON.stringify(state));
  }

}
