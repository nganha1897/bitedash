"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const OrderController_1 = require("../controllers/OrderController");
const GlobalMiddleWare_1 = require("../middlewares/GlobalMiddleWare");
const OrderValidators_1 = require("../validators/OrderValidators");
class OrderRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.getRoutes();
        this.postRoutes();
        this.patchRoutes();
        this.putRoutes();
        this.deleteRoutes();
    }
    getRoutes() {
        this.router.get("/userOrders", GlobalMiddleWare_1.GlobalMiddleWare.auth, OrderController_1.OrderController.getUserOrders);
        this.router.get("/userRecentOrders", GlobalMiddleWare_1.GlobalMiddleWare.auth, OrderController_1.OrderController.getUserRecentOrders);
    }
    postRoutes() {
        this.router.post("/create", GlobalMiddleWare_1.GlobalMiddleWare.auth, OrderValidators_1.OrderValidators.placeOrder(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, OrderController_1.OrderController.placeOrder);
    }
    patchRoutes() { }
    putRoutes() { }
    deleteRoutes() { }
}
exports.default = new OrderRouter().router;
