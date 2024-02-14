import Category from "../models/Category";
import Restaurant from "../models/Restaurant";
import User from "../models/User";
import { Cloudinary } from "../utils/Cloudinary";
import { Utils } from "../utils/Utils";

export class RestaurantController {
  static async addRestaurant(req, res, next) {
    const restaurant = req.body;
    const path = req.file.path;
    const verification_token = Utils.generateVerificationToken();
    const filename = req.file.filename.split(".").slice(0, -1).join(".");
    try {
      const hash = await Utils.encryptPassword(restaurant.password);
      const resulted_path = await Cloudinary.uploadMedia(
        path,
        "feedme/restaurants",
        filename
      );
      const data = {
        email: restaurant.email,
        verification_token,
        verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME,
        phone: restaurant.phone,
        password: hash,
        name: restaurant.name,
        type: "restaurant",
        status: "active",
      };
      const user = await new User(data).save();

      let restaurant_data: any = {
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
        restaurant_data = {
          ...restaurant_data,
          description: restaurant.description,
        };
      const restaurantDoc = await new Restaurant(restaurant_data).save();

      const categoriesData = JSON.parse(restaurant.categories).map((x) => {
        return { name: x, restaurant_id: restaurantDoc._id };
      });
      const categories = Category.insertMany(categoriesData);

      res.send(restaurantDoc);
    } catch (e) {
      next(e);
    }
  }

  static async getNearbyRestaurants(req, res, next) {
    const EARTH_RADIUS_IN_KM = 6378.1;
    const data = req.query;
    const perPage = 10;
    const currentPage = parseInt(data.page) || 1;
    const prevPage = currentPage == 1 ? null : currentPage - 1;
    let nextPage = currentPage + 1;
    console.log(data.radius);
    try {
      const restaurants_doc_count = await Restaurant.countDocuments({
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
      const restaurants = await Restaurant.find({
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
    } catch (e) {
      next(e);
    }
  }

  static async searchNearbyRestaurants(req, res, next) {
    const METERS_PER_KM = 1000;
    const EARTH_RADIUS_IN_KM = 6378.1;
    const data = req.query;
    const perPage = 10;
    const currentPage = parseInt(data.page) || 1;
    const prevPage = currentPage == 1 ? null : currentPage - 1;
    let nextPage = currentPage + 1;
    try {
      const restaurants_doc_count = await Restaurant.countDocuments({
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
      const restaurants = await Restaurant.find({
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
    } catch (e) {
      next(e);
    }
  }

  static async getRestaurants(req, res, next) {
    try {
      const restaurants = await Restaurant.find({
        status: "active",
      });
      res.send(restaurants);
    } catch (e) {
      next(e);
    }
  }
}
