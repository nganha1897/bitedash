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
exports.Cloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const environment_1 = require("../environments/environment");
const fs = require("fs");
cloudinary_1.v2.config({
    cloud_name: (0, environment_1.getEnvironmentVariables)().cloudinary.cloud_name,
    api_key: (0, environment_1.getEnvironmentVariables)().cloudinary.api_key,
    api_secret: (0, environment_1.getEnvironmentVariables)().cloudinary.api_secret,
    secure: true,
});
class Cloudinary {
    static uploadMedia(path, dest_path, filename) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield cloudinary_1.v2.uploader.upload(path, {
                    public_id: filename || Date.now() + "-" + Math.round(Math.random() * 1e9),
                    resource_type: "auto",
                    folder: dest_path,
                });
                fs.unlinkSync(path);
                return ({
                    public_id: result.public_id,
                    url: result.secure_url
                });
            }
            catch (e) {
                throw e;
            }
        });
    }
    static delete_file(file) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield cloudinary_1.v2.uploader.destroy(file);
            if ((res === null || res === void 0 ? void 0 : res.result) === "ok")
                return true;
            return false;
        });
    }
    ;
}
exports.Cloudinary = Cloudinary;
