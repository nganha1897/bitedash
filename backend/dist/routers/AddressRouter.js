"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AddressController_1 = require("../controllers/AddressController");
const GlobalMiddleWare_1 = require("../middlewares/GlobalMiddleWare");
const AddressValidators_1 = require("../validators/AddressValidators");
class AddressRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.getRoutes();
        this.postRoutes();
        this.patchRoutes();
        this.putRoutes();
        this.deleteRoutes();
    }
    getRoutes() {
        this.router.get('/userAddresses', GlobalMiddleWare_1.GlobalMiddleWare.auth, AddressController_1.AddressController.getUserAddresses);
        this.router.get('/checkAddress', GlobalMiddleWare_1.GlobalMiddleWare.auth, AddressValidators_1.AddressValidators.checkAddress(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, AddressController_1.AddressController.checkAddress);
        this.router.get('/getUserLimitedAddresses', GlobalMiddleWare_1.GlobalMiddleWare.auth, AddressValidators_1.AddressValidators.getUserLimitedAddresses(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, AddressController_1.AddressController.getUserLimitedAddresses);
    }
    postRoutes() {
        this.router.post('/create', GlobalMiddleWare_1.GlobalMiddleWare.auth, AddressValidators_1.AddressValidators.addAddress(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, AddressController_1.AddressController.addAddress);
    }
    patchRoutes() {
    }
    putRoutes() {
        this.router.put('/edit/:id', GlobalMiddleWare_1.GlobalMiddleWare.auth, AddressValidators_1.AddressValidators.editAddress(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, AddressController_1.AddressController.editAddress);
    }
    deleteRoutes() {
        this.router.delete('/delete/:id', GlobalMiddleWare_1.GlobalMiddleWare.auth, AddressController_1.AddressController.deleteAddress);
    }
}
exports.default = new AddressRouter().router;
