
export class ProductOptions {
  public shoeSize: string = "";
  public color: string = "";
  public sortOption: string = "Price High to Low";
  public pageSize = 8;
  public pageNo = 1;
  public subcategory: string | undefined;

  constructor(public category: string) { }
}
