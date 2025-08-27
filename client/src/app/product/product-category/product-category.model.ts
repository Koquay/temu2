export class ProductCategoryModel {
    _id: string = '';
    name?: string;
    img?: string;
    categories?: [
        {
            _id: string;
            name: string;
            img?: string;
        }
    ]
}