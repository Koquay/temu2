export class ProductModel {
    _id: string = '';
    description: string = '';
    name: string = '';
    price: number = 0;
    discount: number = 0;
    rating: number = 0;
    category: string = '';
    subcategory: string = '';
    productCount: number = 0;

    images: string[] = [];
    colors: { img: string; name: string }[] = [];

    sizes: string[] = [];
}
