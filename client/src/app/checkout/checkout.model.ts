import { CartItem } from "../cart/cart.item";


export class CheckoutModel {

    deliveryAddress = {
        firstName: '',
        lastName: '',
        phone: '',
        address1: '',
        address2: '',
        deliveryPostalCode: '',
        useAsBillingAddress: true,
    };

    paymentType = 'CreditCard';
    billingPostalCode = '';


    cart: CartItem[] = [];
}