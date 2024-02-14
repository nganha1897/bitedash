import { body } from "express-validator";
import Restaurant from "../models/Restaurant";

export class OrderValidators {
  static placeOrder() {
    return [
      body("restaurant_id", "Restaurant ID is required")
        .isString()
        .custom((restaurant_id, { req }) => {
          return Restaurant.findById(restaurant_id)
            .then((restaurant) => {
              if (restaurant) {
                req.restaurant = restaurant;
                return true;
              } else {
                throw "Restaurant doesn't exist";
              }
            })
            .catch((e) => {
              throw new Error(e);
            });
        }),
      body("order", "Order item is required").isString(),
      body("address", "Address is required").isString(),
      body("status", "Order status is required").isString(),
      body("payment_status", "Payment status is required").isBoolean(),
      body("payment_mode", "Payment mode is required").isString(),
      body("total", "Order total is required").isNumeric(),
      body("grandTotal", "Order grand total is required").isNumeric(),
      body("deliveryCharge", "Delivery charge is required").isNumeric(),
    ];
  }
}
