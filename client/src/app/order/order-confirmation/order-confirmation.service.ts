import { effect, inject, Injectable, signal } from '@angular/core';
import { OrderModel } from './order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderConfirmationService {
  public orderSignal = signal<{ order: OrderModel }>({ order: new OrderModel() });

  public saveOrder = (order: any) => {
    console.log("OrderConfirmationService order", order)
    this.orderSignal.set({ order })

    console.log("OrderConfirmationService orderSignal()", this.orderSignal())
  }

}
