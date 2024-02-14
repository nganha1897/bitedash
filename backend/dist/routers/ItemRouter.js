"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ItemController_1 = require("../controllers/ItemController");
const GlobalMiddleWare_1 = require("../middlewares/GlobalMiddleWare");
const Utils_1 = require("../utils/Utils");
const ItemValidators_1 = require("../validators/ItemValidators");
class ItemRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.getRoutes();
        this.postRoutes();
        this.patchRoutes();
        this.putRoutes();
        this.deleteRoutes();
    }
    getRoutes() {
        this.router.get('/menuItems/:restaurantId', GlobalMiddleWare_1.GlobalMiddleWare.auth, ItemValidators_1.ItemValidators.getMenuItems(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, ItemController_1.ItemController.getMenu);
    }
    postRoutes() {
        this.router.post('/create', GlobalMiddleWare_1.GlobalMiddleWare.auth, GlobalMiddleWare_1.GlobalMiddleWare.adminRole, new Utils_1.Utils().multer.single('itemImages'), ItemValidators_1.ItemValidators.addItem(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, ItemController_1.ItemController.addItem);
    }
    patchRoutes() {
    }
    putRoutes() { }
    deleteRoutes() { }
}
exports.default = new ItemRouter().router;
