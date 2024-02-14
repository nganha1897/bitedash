"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const Order_1 = require("../models/Order");
class OrderController {
    static placeOrder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = req.body;
            const user_id = req.user.aud;
            const restaurant = req.restaurant;
            try {
                let orderData = {
                    user_id,
                    restaurant_id: data.restaurant_id,
                    order: data.order,
                    address: data.address,
                    status: data.status,
                    payment_status: data.payment_status,
                    payment_mode: data.payment_mode,
                    total: data.total,
                    grandTotal: data.grandTotal,
                    deliveryCharge: data.deliveryCharge,
                };
                if (data.instruction)
                    orderData = Object.assign(Object.assign({}, orderData), { instruction: data.instruction });
                if (data.payment_id)
                    orderData = Object.assign(Object.assign({}, orderData), { payment_id: data.payment_id });
                const order = yield new Order_1.default(orderData).save();
                let response_order = {
                    restaurant_id: restaurant,
                    address: order.address,
                    order: JSON.parse(order.order),
                    instruction: order.instruction || null,
                    grandTotal: order.grandTotal,
                    total: order.total,
                    deliveryCharge: order.deliveryCharge,
                    status: order.status,
                    payment_status: order.payment_status,
                    payment_mode: order.payment_mode,
                    created_at: order.created_at,
                    updated_at: order.updated_at,
                };
                if (order.payment_id)
                    response_order = Object.assign(Object.assign({}, response_order), { payment_id: order.payment_id });
                res.send(response_order);
            }
            catch (e) {
                next(e);
            }
        });
    }
    static getUserOrders(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user_id = req.user.aud;
            const perPage = 5;
            const currentPage = parseInt(req.query.page) || 1;
            const prevPage = currentPage == 1 ? null : currentPage - 1;
            let nextPage = currentPage + 1;
            try {
                const orders_doc_count = yield Order_1.default.countDocuments({ user_id: user_id });
                if (!orders_doc_count) {
                    res.json({
                        orders: [],
                        perPage,
                        currentPage,
                        prevPage,
                        nextPage: null,
                        totalPages: 0,
                    });
                }
                const totalPages = Math.ceil(orders_doc_count / perPage);
                if (totalPages == 0 || totalPages == currentPage) {
                    nextPage = null;
                }
                if (totalPages < currentPage) {
                    throw "No more Orders available";
                }
                const orders = yield Order_1.default.find({ user_id }, { user_id: 0, __v: 0 })
                    .skip(perPage * currentPage - perPage)
                    .limit(perPage)
                    .sort({ created_at: -1 })
                    .populate("restaurant_id")
                    .exec();
                res.json({
                    orders,
                    perPage,
                    currentPage,
                    prevPage,
                    nextPage,
                    totalPages,
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
    static getUserRecentOrders(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user_id = req.user.aud;
            const limit = req.query.limit;
            try {
                const orders = yield Order_1.default.find({ user_id }, { user_id: 0, __v: 0 })
                    .limit(limit)
                    .sort({ created_at: -1 })
                    .populate("restaurant_id")
                    .exec();
                res.json({
                    orders,
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
}
exports.OrderController = OrderController;
