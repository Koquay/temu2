import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OrderSummaryComponent } from '../order-summary/order-summary.component';
import { DiscountPricePipe } from '../../shared/pipes/discount-price.pipe';
import { OrderModel } from './order.model';
import { OrderConfirmationService } from './order-confirmation.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    CommonModule,
    DiscountPricePipe,
    OrderSummaryComponent
  ],
  templateUrl: './order-confirmation.component.html',
  styleUrl: './order-confirmation.component.scss'
})
export class OrderConfirmationComponent {
  public order: OrderModel = new OrderModel();
  private orderConfirmationService = inject(OrderConfirmationService);

  ngOnInit() {
    window.scrollTo(0, 0);
  }

  orderConfirmationEffect = effect(() => {
    this.order = this.orderConfirmationService.orderSignal().order;
  })

}
