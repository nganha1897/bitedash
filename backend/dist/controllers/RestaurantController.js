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
exports.RestaurantController = void 0;
const Category_1 = require("../models/Category");
const Restaurant_1 = require("../models/Restaurant");
const User_1 = require("../models/User");
const Cloudinary_1 = require("../utils/Cloudinary");
const Utils_1 = require("../utils/Utils");
class RestaurantController {
    static addRestaurant(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const restaurant = req.body;
            const path = req.file.path;
            const verification_token = Utils_1.Utils.generateVerificationToken();
            const filename = req.file.filename.split(".").slice(0, -1).join(".");
            try {
                const hash = yield Utils_1.Utils.encryptPassword(restaurant.password);
                const resulted_path = yield Cloudinary_1.Cloudinary.uploadMedia(path, "feedme/restaurants", filename);
                const data = {
                    email: restaurant.email,
                    verification_token,
                    verification_token_time: Date.now() + new Utils_1.Utils().MAX_TOKEN_TIME,
                    phone: restaurant.phone,
                    password: hash,
                    name: restaurant.name,
                    type: "restaurant",
                    status: "active",
                };
                const user = yield new User_1.default(data).save();
                let restaurant_data = {
                    name: restaurant.res_name,
                    location: JSON.parse(restaurant.location),
                    address: restaurant.address,
                    openTime: restaurant.openTime,
                    closeTime: restaurant.closeTime,
                    status: restaurant.status,
                    cuisines: JSON.parse(restaurant.cuisines),
                    price: parseFloat(restaurant.price),
                    delivery_time: parseInt(restaurant.delivery_time),
                    city_id: restaurant.city_id,
                    user_id: user._id,
                    cover: resulted_path.url,
                };
                if (restaurant.description)
                    restaurant_data = Object.assign(Object.assign({}, restaurant_data), { description: restaurant.description });
                const restaurantDoc = yield new Restaurant_1.default(restaurant_data).save();
                const categoriesData = JSON.parse(restaurant.categories).map((x) => {
                    return { name: x, restaurant_id: restaurantDoc._id };
                });
                const categories = Category_1.default.insertMany(categoriesData);
                res.send(restaurantDoc);
            }
            catch (e) {
                next(e);
            }
        });
    }
    static getNearbyRestaurants(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const EARTH_RADIUS_IN_KM = 6378.1;
            const data = req.query;
            const perPage = 10;
            const currentPage = parseInt(data.page) || 1;
            const prevPage = currentPage == 1 ? null : currentPage - 1;
            let nextPage = currentPage + 1;
            console.log(data.radius);
            try {
                const restaurants_doc_count = yield Restaurant_1.default.countDocuments({
                    location: {
                        $geoWithin: {
                            $centerSphere: [
                                [parseFloat(data.lng), parseFloat(data.lat)],
                                parseFloat(data.radius) / EARTH_RADIUS_IN_KM,
                            ],
                        },
                    },
                    status: "active",
                });
                if (!restaurants_doc_count) {
                    res.json({
                        restaurants: [],
                        perPage,
                        currentPage,
                        prevPage,
                        nextPage: null,
                        totalPages: 0,
                    });
                }
                const totalPages = Math.ceil(restaurants_doc_count / perPage);
                if (totalPages == 0 || totalPages == currentPage) {
                    nextPage = null;
                }
                if (totalPages < currentPage) {
                    throw "No more Restaurants available";
                }
                const restaurants = yield Restaurant_1.default.find({
                    location: {
                        $nearSphere: {
                            $geometry: {
                                type: "Point",
                                coordinates: [parseFloat(data.lng), parseFloat(data.lat)],
                            },
                            $maxDistance: parseFloat(data.radius) * EARTH_RADIUS_IN_KM,
                        },
                    },
                    status: "active",
                })
                    .skip(currentPage * perPage - perPage)
                    .limit(perPage);
                res.json({
                    restaurants,
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
    static searchNearbyRestaurants(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const METERS_PER_KM = 1000;
            const EARTH_RADIUS_IN_KM = 6378.1;
            const data = req.query;
            const perPage = 10;
            const currentPage = parseInt(data.page) || 1;
            const prevPage = currentPage == 1 ? null : currentPage - 1;
            let nextPage = currentPage + 1;
            try {
                const restaurants_doc_count = yield Restaurant_1.default.countDocuments({
                    location: {
                        $geoWithin: {
                            $centerSphere: [
                                [parseFloat(data.lng), parseFloat(data.lat)],
                                parseFloat(data.radius) / EARTH_RADIUS_IN_KM,
                            ],
                        },
                    },
                    status: "active",
                    name: { $regex: data.name, $options: "i" },
                });
                if (!restaurants_doc_count) {
                    res.json({
                        restaurants: [],
                        perPage,
                        currentPage,
                        prevPage,
                        nextPage: null,
                        totalPages: 0,
                    });
                }
                const totalPages = Math.ceil(restaurants_doc_count / perPage);
                if (totalPages == 0 || totalPages == currentPage) {
                    nextPage = null;
                }
                if (totalPages < currentPage) {
                    throw "No more Restaurants available";
                }
                const restaurants = yield Restaurant_1.default.find({
                    location: {
                        $nearSphere: {
                            $geometry: {
                                type: "Point",
                                coordinates: [parseFloat(data.lng), parseFloat(data.lat)],
                            },
                            $maxDistance: parseFloat(data.radius) * EARTH_RADIUS_IN_KM,
                        },
                    },
                    status: "active",
                    name: { $regex: data.name, $options: "i" },
                })
                    .skip(currentPage * perPage - perPage)
                    .limit(perPage);
                res.json({
                    restaurants,
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
    static getRestaurants(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const restaurants = yield Restaurant_1.default.find({
                    status: "active",
                });
                res.send(restaurants);
            }
            catch (e) {
                next(e);
            }
        });
    }
}
exports.RestaurantController = RestaurantController;
