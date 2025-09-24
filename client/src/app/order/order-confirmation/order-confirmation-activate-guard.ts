import { inject, Injectable } from "@angular/core";
import { CanActivateFn, } from "@angular/router";
import { CartService } from "./order-confirmation.service";
import { toObservable } from '@angular/core/rxjs-interop';
import { map, take } from 'rxjs/operators';
import { ToastrService } from "ngx-toastr";

export const canActivateCart: CanActivateFn = () => {
    const cartService = inject(CartService);
    const toastr = inject(ToastrService);
    let showCart = false;

    return toObservable(cartService.cartSignal).pipe(
        take(1), // take one value and complete
        map(cart => {
            //     console.log('cartSignal (observable):', cart);

            //     let cartLength = cart.cartModel.cart.length

            //     if (!cartLength) {
            //         toastr.warning("Your cart may be empty. Please sign in to bring your cart from the server.", 'Cart',
            //             { positionClass: getScrollPos() }
            //         );
            //     }
            //     showCart = cartLength > 0;

            //     if (showCart) {
            //         return true;
            //     } else {
            //         if (getGuestCart().length) {
            //             return true;
            //         }
            //     }

            return true;
        })
    );
};
