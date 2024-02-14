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
exports.BannerController = void 0;
const Banner_1 = require("../models/Banner");
const Cloudinary_1 = require("../utils/Cloudinary");
class BannerController {
    static addBanner(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = req.file.path;
            const filename = req.file.filename.split(".").slice(0, -1).join(".");
            try {
                const resulted_path = yield Cloudinary_1.Cloudinary.uploadMedia(path, "feedme/banners", filename);
                let data = {
                    banner: resulted_path.url,
                };
                if (req.body.restaurant_id) {
                    data = Object.assign(Object.assign({}, data), { restaurant_id: req.body.restaurant_id });
                }
                const banner = yield new Banner_1.default(data).save();
                res.send(banner);
            }
            catch (e) {
                next(e);
            }
        });
    }
    static getBanners(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const banners = yield Banner_1.default.find({ status: true });
                res.send(banners);
            }
            catch (e) {
                next(e);
            }
        });
    }
}
exports.BannerController = BannerController;
