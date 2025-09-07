import { inject, Injectable } from "@angular/core";
import { CanActivateFn, } from "@angular/router";
import { CartService } from "./cart.service";
import { toObservable } from '@angular/core/rxjs-interop';
import { map, take } from 'rxjs/operators';
import { ToastrService } from "ngx-toastr";
import { getScrollPos } from "../shared/utils/getScrollPos";

export const canActivateCart: CanActivateFn = () => {
    const cartService = inject(CartService);
    const toastr = inject(ToastrService);

    return toObservable(cartService.cartSignal).pipe(
        take(1), // take one value and complete
        map(cartItems => {
            console.log('cartSignal (observable):', cartItems);

            const cartLength = cartItems.length;

            if (!cartLength) {
                toastr.warning("Your cart may be empty. Please sign in to bring your cart from the server.", 'Cart',
                    { positionClass: getScrollPos() }
                );
            }
            return cartLength > 0;
        })
    );
};