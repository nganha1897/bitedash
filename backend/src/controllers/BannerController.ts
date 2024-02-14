import Banner from "../models/Banner";
import { Cloudinary } from "../utils/Cloudinary";

export class BannerController {
  static async addBanner(req, res, next) {
    const path = req.file.path;
    const filename = req.file.filename.split(".").slice(0, -1).join(".");
    try {
      const resulted_path = await Cloudinary.uploadMedia(
        path,
        "feedme/banners",
        filename
      );
      let data: any = {
        banner: resulted_path.url,
      };
      if (req.body.restaurant_id) {
        data = { ...data, restaurant_id: req.body.restaurant_id };
      }
      const banner = await new Banner(data).save();
      res.send(banner);
    } catch (e) {
      next(e);
    }
  }

  static async getBanners(req, res, next) {
    try {
      const banners = await Banner.find({ status: true });
      res.send(banners);
    } catch (e) {
      next(e);
    }
  }
}
