import { CartItem } from "../cart/cart.item";


export class CheckoutModel {

    deliveryAddress = {
        firstName: '',
        lastName: '',
        phone: '',
        address1: '',
        address2: '',
        useAsBillingAddress: true,
    };

    paymentType = 'CreditCard';

    // paymentMethod = {
    //     paymentType: 'CreditCard',
    //     cardNumber: '',
    //     expMonth: null,
    //     expYear: null,
    //     CVV: '',
    //     defaultCreditCard: true,
    // };

    cart: CartItem[] = [];
}