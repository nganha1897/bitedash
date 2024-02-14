"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevEnvironment = void 0;
const Utils_1 = require("../utils/Utils");
Utils_1.Utils.dotenvConfigs();
exports.DevEnvironment = {
    db_uri: process.env.DEV_DB_URI,
    jwt_secret_key: process.env.DEV_JWT_SECRET_KEY,
    jwt_refresh_secret_key: process.env.DEV_REFRESH_TOKEN_SECRET,
    sendgrid: {
        api_key: process.env.DEV_SENDGRID_API_KEY,
        email_from: process.env.DEV_SENDGRID_SENDER_EMAIL
    },
    redis: {
        username: null,
        password: null,
        host: process.env.LOCAL_REDIS_HOST,
        port: parseInt(process.env.LOCAL_REDIS_PORT)
    },
    cloudinary: {
        cloud_name: process.env.DEV_CLOUDINARY_CLOUD_NAME,
        api_key: process.env.DEV_CLOUDINARY_API_KEY,
        api_secret: process.env.DEV_CLOUDINARY_API_SECRET
    }
};
