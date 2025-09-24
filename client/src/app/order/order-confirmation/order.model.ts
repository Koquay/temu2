import { CartItem } from "./cart.item";

export class OrderModel {
    _id: string = '';
    userId: string = '';
    cart: CartItem[] = [];

    deliveryAddress = {
        firstName: "",
        lastName: "",
        phone: "",
        address1: "",
        address2: "",
        useAsBillingAddress: true
    }
}