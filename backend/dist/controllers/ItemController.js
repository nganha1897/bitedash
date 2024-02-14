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
exports.ItemController = void 0;
const Category_1 = require("../models/Category");
const Item_1 = require("../models/Item");
const Cloudinary_1 = require("../utils/Cloudinary");
class ItemController {
    static addItem(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const itemData = req.body;
            const path = req.file.path;
            const filename = req.file.filename.split(".").slice(0, -1).join(".");
            try {
                const resulted_path = yield Cloudinary_1.Cloudinary.uploadMedia(path, "feedme/items", filename);
                let item_data = {
                    name: itemData.name,
                    status: itemData.status,
                    price: parseFloat(itemData.price),
                    veg: itemData.veg,
                    category_id: itemData.category_id,
                    restaurant_id: itemData.restaurant_id,
                    cover: resulted_path.url,
                };
                if (itemData.description)
                    item_data = Object.assign(Object.assign({}, item_data), { description: itemData.description });
                const itemDoc = yield new Item_1.default(item_data).save();
                res.send(itemDoc);
            }
            catch (e) {
                next(e);
            }
        });
    }
    static getMenu(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const restaurant = req.restaurant;
            try {
                const categories = yield Category_1.default.find({ restaurant_id: restaurant._id }, { __v: 0 });
                const items = yield Item_1.default.find({
                    restaurant_id: restaurant._id,
                });
                res.json({
                    restaurant,
                    categories,
                    items,
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
}
exports.ItemController = ItemController;
