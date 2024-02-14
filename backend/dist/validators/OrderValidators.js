"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderValidators = void 0;
const express_validator_1 = require("express-validator");
const Restaurant_1 = require("../models/Restaurant");
class OrderValidators {
    static placeOrder() {
        return [
            (0, express_validator_1.body)("restaurant_id", "Restaurant ID is required")
                .isString()
                .custom((restaurant_id, { req }) => {
                return Restaurant_1.default.findById(restaurant_id)
                    .then((restaurant) => {
                    if (restaurant) {
                        req.restaurant = restaurant;
                        return true;
                    }
                    else {
                        throw "Restaurant doesn't exist";
                    }
                })
                    .catch((e) => {
                    throw new Error(e);
                });
            }),
            (0, express_validator_1.body)("order", "Order item is required").isString(),
            (0, express_validator_1.body)("address", "Address is required").isString(),
            (0, express_validator_1.body)("status", "Order status is required").isString(),
            (0, express_validator_1.body)("payment_status", "Payment status is required").isBoolean(),
            (0, express_validator_1.body)("payment_mode", "Payment mode is required").isString(),
            (0, express_validator_1.body)("total", "Order total is required").isNumeric(),
            (0, express_validator_1.body)("grandTotal", "Order grand total is required").isNumeric(),
            (0, express_validator_1.body)("deliveryCharge", "Delivery charge is required").isNumeric(),
        ];
    }
}
exports.OrderValidators = OrderValidators;
