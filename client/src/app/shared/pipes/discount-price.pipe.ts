import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'discountPricePipe',
  standalone: true
})
export class DiscountPricePipe implements PipeTransform {

  transform(price: number, discount: number): unknown {
    let discountPricePipe = price - (discount / 100 * price)

    return '$' + discountPricePipe.toFixed(2);
  }

}