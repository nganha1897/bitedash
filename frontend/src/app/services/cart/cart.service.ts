import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Strings } from 'src/app/enum/strings';
import { Cart } from 'src/app/interfaces/cart.interface';
import { Item } from 'src/app/models/item.model';
import { Order } from 'src/app/models/order.model';
import { Restaurant } from 'src/app/models/restaurant.model';
import { GlobalService } from '../global/global.service';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  model = {} as Cart;
  deliveryCharge = 0;
  private _cart = new BehaviorSubject<Cart>(null);

  get cart() {
    return this._cart.asObservable();
  }

  constructor(
    private storage: StorageService,
    private global: GlobalService,
    private router: Router
  ) {}

  getCart() {
    return this.storage.getStorage(Strings.CART_STORAGE);
  }

  getCartOrder() {
    return this.storage.getStorage(Strings.CART_ORDER);
  }

  async getCartData(val?) {
    let data: any = await this.getCart();
    if (data?.value) {
      this.model = await JSON.parse(data.value);
      await this.calculate();
      if (!val) this._cart.next(this.model);
    }
  }

  alertClearCart(index, items, data, order?) {
    this.global.showAlert(
      order
        ? 'Would you like to reset your cart before reordering from this restaurant?'
        : 'Your cart contains items from a different restaurant. Would you like to reset your cart before browsing this restaurant?',
      'Items already in cart',
      [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            return;
          },
        },
        {
          text: 'Yes',
          handler: () => {
            this.clear(index, items, data, order);
          },
        },
      ]
    );
  }

  async clear(index, items, data, order?) {
    await this.clearCart();
    this.model = {} as Cart;
    if (order) {
      this.orderToCart(order);
    } else this.quantityPlus(index, items, data);
  }

  async orderToCart(order: Order) {
    const data = {
      restaurant: order.restaurant_id,
      items: order.order,
    };
    this.model = data;
    await this.calculate();
    this.saveCart();
    this._cart.next(this.model);
    this.router.navigate(['/', 'tabs', 'restaurants', order.restaurant_id._id]);
  }

  async quantityPlus(index, items?: Item[], restaurant?: Restaurant) {
    try {
      if (items) {
        this.model.items = [...items];
      }
      if (restaurant) {
        this.model.restaurant = restaurant;
      }
      if (
        !this.model.items[index].quantity ||
        this.model.items[index].quantity == 0
      ) {
        this.model.items[index].quantity = 1;
      } else {
        this.model.items[index].quantity += 1;
      }
      await this.calculate();
      this._cart.next(this.model);
      return this.model;
    } catch (e) {
      this.global.checkMessageForErrorToast(e);
      return this.model;
    }
  }

  async quantityMinus(index, items?: Item[]) {
    try {
      if (items) {
        this.model.items = [...items];
      }
      if (
        this.model.items[index].quantity &&
        this.model.items[index].quantity !== 0
      ) {
        this.model.items[index].quantity -= 1;
      } else {
        this.model.items[index].quantity = 0;
      }
      await this.calculate();
      this._cart.next(this.model);
      return this.model;
    } catch (e) {
      this.global.checkMessageForErrorToast(e);
      return this.model;
    }
  }

  async calculate() {
    let item = this.model.items.filter((x) => x.quantity > 0);
    this.model.items = item;
    this.model.totalPrice = 0;
    this.model.totalItem = 0;
    this.model.deliveryCharge = 0;
    this.model.grandTotal = 0;
    item.forEach((element) => {
      this.model.totalItem += element.quantity;
      this.model.totalPrice += element.price * element.quantity;
    });
    this.model.deliveryCharge = this.deliveryCharge;
    this.model.grandTotal = this.model.totalPrice + this.model.deliveryCharge;
    if (this.model.totalItem == 0) {
      this.model.totalItem = 0;
      this.model.totalPrice = 0;
      this.model.grandTotal = 0;
      await this.clearCart();
      this.model = {} as Cart;
    }
  }

  async clearCart() {
    this.global.showLoader();
    await this.storage.removeStorage(Strings.CART_STORAGE);
    this._cart.next(null);
    this.global.hideLoader();
  }

  saveCart(model?) {
    if (model) this.model = model;
    this.storage.setStorage(Strings.CART_STORAGE, JSON.stringify(this.model));
  }

  saveCartOrder(model) {
    this.storage.setStorage(Strings.CART_ORDER, JSON.stringify(model));
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  getDistanceFromLatLngInKm(lat1, lng1, lat2, lng2) {
    let radius = 6371; // Radius of earth in km
    let lat = this.deg2rad(lat2 - lat1);
    let lng = this.deg2rad(lng2 - lng1);

    let result =
      Math.sin(lat / 2) * Math.sin(lat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(lng / 2) *
        Math.sin(lng / 2);
    var c = 2 * Math.atan2(Math.sqrt(result), Math.sqrt(1 - result));
    var d = radius * c; // Distance in km
    return d;
  }

  async checkCart(lat1, lng1, radius) {
    let distance: number;
    await this.getCartData(1);
    if (this.model?.restaurant) {
      distance = this.getDistanceFromLatLngInKm(
        lat1,
        lng1,
        this.model.restaurant.location.coordinates[1],
        this.model.restaurant.location.coordinates[0]
      );
      if (distance > radius) {
        return true;
      } else return false;
    } else return false;
  }
}
