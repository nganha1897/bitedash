import { v2 as cloudinary } from "cloudinary";
import { getEnvironmentVariables } from "../environments/environment";
import * as fs from "fs";

cloudinary.config({
  cloud_name: getEnvironmentVariables().cloudinary.cloud_name,
  api_key: getEnvironmentVariables().cloudinary.api_key,
  api_secret: getEnvironmentVariables().cloudinary.api_secret,
  secure: true,
});

export class Cloudinary {
  
  static async uploadMedia(
    path: string,
    dest_path: string,
    filename?: string
  ) {
    try {    
      let result = await cloudinary.uploader.upload(path, {
        public_id:
          filename || Date.now() + "-" + Math.round(Math.random() * 1e9),
        resource_type: "auto",
        folder: dest_path,
      });
      
      fs.unlinkSync(path);
      return (
        { 
          public_id: result.public_id, 
          url: result.secure_url 
        }
      );
    } catch (e) {
      throw e;
    }
  }

  static async delete_file (file: string) {
    const res = await cloudinary.uploader.destroy(file);

    if (res?.result === "ok") return true;

    return false;
  };
}
