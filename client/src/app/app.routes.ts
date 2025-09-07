import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductComponent } from './product/product.component';
import { ProductDisplayService } from './product/prodduct-display/product-display.service';
import { ProdductDisplayComponent } from './product/prodduct-display/prodduct-display.component';
import { ProductViewComponent } from './product/product-view/product-view.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ProductSearchComponent } from './product/product-search/product-search.component';
import { canActivateCart } from './cart/cart.can-activate-guard';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'product/:categoryId', component: ProductComponent },
    { path: 'product-display/:subcategoryId', component: ProdductDisplayComponent },
    { path: 'product-view/:productId', component: ProductViewComponent },
    { path: 'product-search', component: ProductSearchComponent },
    {
        path: 'cart',
        component: CartComponent,
        canActivate: [canActivateCart],
    },
    { path: 'checkout', component: CheckoutComponent },

    {
        path: '',
        pathMatch: 'prefix',
        redirectTo: 'home'
    },
];
