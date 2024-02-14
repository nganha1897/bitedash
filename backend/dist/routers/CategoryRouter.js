"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CategoryController_1 = require("../controllers/CategoryController");
const GlobalMiddleWare_1 = require("../middlewares/GlobalMiddleWare");
class CategoryRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.getRoutes();
        this.postRoutes();
        this.patchRoutes();
        this.putRoutes();
        this.deleteRoutes();
    }
    getRoutes() {
        this.router.get('/getCategories/:restaurantId', GlobalMiddleWare_1.GlobalMiddleWare.auth, CategoryController_1.CategoryController.getCategoriesByRestaurant);
    }
    postRoutes() {
    }
    patchRoutes() {
    }
    putRoutes() { }
    deleteRoutes() { }
}
exports.default = new CategoryRouter().router;
