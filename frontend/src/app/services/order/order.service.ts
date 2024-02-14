import { Injectable } from '@angular/core';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { Order } from 'src/app/models/order.model';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private _orders = new BehaviorSubject<Order[]>([]);

  get orders() {
    return this._orders.asObservable();
  }

  constructor(private api: ApiService) { }

  async getOrders(page?) {
    try {
      const data: any = await lastValueFrom(this.api.get('order/userOrders', page ? { page } : null));
      if(data) {
        let orders: Order[] = data.orders.map((order: any) => {
            return {...order, order: JSON.parse(order.order)};
          });
        if(page && page > 1) {
          let appended_orders: Order[] = this._orders.value;
          appended_orders = appended_orders.concat(orders);
          orders = [...appended_orders];
        }
        this._orders.next(orders);
      }
      return data;
    } catch(e) {
      throw(e);
    }
  }

  async placeOrder(param) {
    try {
      param = { ...param, order: JSON.stringify(param.order) };
      const order: Order = await lastValueFrom(this.api.post('order/create', param));
      let currentOrders: Order[] = [];
      currentOrders.push(order);
      currentOrders = currentOrders.concat(this._orders.value);
      this._orders.next(currentOrders);
      return currentOrders;
    } catch(e) {
      throw(e);
    }
  }

}
