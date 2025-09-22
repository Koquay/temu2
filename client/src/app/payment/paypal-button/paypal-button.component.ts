import { Component, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

declare var paypal: any;

@Component({
  selector: 'app-paypal-button',
  standalone: true,
  template: `<div id="paypal-button-container"></div>`,
})
export class PaypalButtonComponent implements AfterViewInit {
  private createPaymentUrl = '/api/payment/create-paypal-order';
  private captureOrderUrl = '/api/payment/capture-paypal-order';

  constructor(private http: HttpClient) { }

  ngAfterViewInit(): void {
    paypal.Buttons({
      createOrder: async () => {
        const order = await this.http.post<any>(this.createPaymentUrl, {}).toPromise();
        console.log('createOrder.order.id', order.id);
        return order.id; // PayPal needs the orderID from backend
      },
      onApprove: async (data: any) => {
        const capture = await fetch(`${this.captureOrderUrl}/${data.orderID}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        }).then(res => res.json());

        console.log('Payment captured:', capture);
      },
      onError: (err: any) => {
        console.error('PayPal error:', err);
      },
    }).render('#paypal-button-container');
  }
}
