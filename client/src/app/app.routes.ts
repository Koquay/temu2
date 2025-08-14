import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductComponent } from './product/product.component';
import { ProductDisplayService } from './product/prodduct-display/product-display.service';
import { ProdductDisplayComponent } from './product/prodduct-display/prodduct-display.component';
import { ProductViewComponent } from './product/product-view/product-view.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'product/:categoryId', component: ProductComponent },
    { path: 'product-display/:subcategoryId', component: ProdductDisplayComponent },
    { path: 'product-view/:productId', component: ProductViewComponent },

    {
        path: '',
        pathMatch: 'prefix',
        redirectTo: 'home'
    },
];
