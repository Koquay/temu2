import { ProductModel } from "../product/product.model";

export class CartItem {
    productId: string = '';
    name: string = '';
    size: string = '';
    qty: number = 1;
    img: string = '';
    product: ProductModel = new ProductModel();
}