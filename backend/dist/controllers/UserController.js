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
exports.UserController = void 0;
const Jwt_1 = require("./../utils/Jwt");
const NodeMailer_1 = require("./../utils/NodeMailer");
const Utils_1 = require("./../utils/Utils");
const User_1 = require("../models/User");
class UserController {
    static signup(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const name = req.body.name;
            const phone = req.body.phone;
            const email = req.body.email;
            const password = req.body.password;
            const type = req.body.type;
            const status = req.body.status;
            const verification_token = Utils_1.Utils.generateVerificationToken();
            try {
                const hash = yield Utils_1.Utils.encryptPassword(password);
                const data = {
                    email,
                    verification_token,
                    verification_token_time: Date.now() + new Utils_1.Utils().MAX_TOKEN_TIME,
                    phone,
                    password: hash,
                    name,
                    type,
                    status,
                };
                const user = yield new User_1.default(data).save();
                const user_data = {
                    email: user.email,
                    email_verified: user.email_verified,
                    phone: user.phone,
                    name: user.name,
                    type: user.type,
                    status: user.status,
                    created_at: user.created_at,
                    updated_at: user.updated_at,
                };
                const payload = {
                    email: user.email,
                    type: user.type,
                };
                const access_token = Jwt_1.Jwt.jwtSign(payload, user._id);
                const refresh_token = yield Jwt_1.Jwt.jwtSignRefreshToken(payload, user._id);
                res.json({
                    token: access_token,
                    refreshToken: refresh_token,
                    user: user_data,
                });
                // send verification email to user
                yield NodeMailer_1.NodeMailer.sendMail({
                    to: [user.email],
                    subject: "Email Verification",
                    html: `<h1>Your otp is ${verification_token}</h1>`,
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
    static verifyUserEmailToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const verification_token = req.body.verification_token;
            const email = req.user.email;
            try {
                const user = yield User_1.default.findOneAndUpdate({
                    email: email,
                    verification_token: verification_token,
                    verification_token_time: { $gt: Date.now() },
                }, {
                    email_verified: true,
                    updated_at: new Date(),
                }, {
                    new: true,
                    projection: {
                        verification_token: 0,
                        verification_token_time: 0,
                        password: 0,
                        reset_password_token: 0,
                        reset_password_token_time: 0,
                        __v: 0,
                        _id: 0,
                    },
                });
                if (user) {
                    res.send(user);
                }
                else {
                    throw new Error("Wrong otp or email verification token is expired. Please try again!");
                }
            }
            catch (e) {
                next(e);
            }
        });
    }
    static resendVerificationEmail(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const email = req.user.email;
            const verification_token = Utils_1.Utils.generateVerificationToken();
            try {
                const user = yield User_1.default.findOneAndUpdate({ email: email }, {
                    updated_at: new Date(),
                    verification_token: verification_token,
                    verification_token_time: Date.now() + new Utils_1.Utils().MAX_TOKEN_TIME,
                });
                if (user) {
                    res.json({ success: true });
                    yield NodeMailer_1.NodeMailer.sendMail({
                        to: [user.email],
                        subject: "Resend email verification",
                        html: `<h1>Your otp is ${verification_token}</h1>`,
                    });
                }
                else {
                    throw new Error("User doesn't exist");
                }
            }
            catch (e) {
                next(e);
            }
        });
    }
    static login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.user;
            const password = req.query.password;
            const data = {
                password,
                encrypt_password: user.password,
            };
            try {
                yield Utils_1.Utils.comparePassword(data);
                const payload = {
                    email: user.email,
                    type: user.type,
                };
                const access_token = Jwt_1.Jwt.jwtSign(payload, user._id);
                const refresh_token = yield Jwt_1.Jwt.jwtSignRefreshToken(payload, user._id);
                const user_data = {
                    email: user.email,
                    email_verified: user.email_verified,
                    phone: user.phone,
                    name: user.name,
                    type: user.type,
                    status: user.status,
                    created_at: user.created_at,
                    updated_at: user.updated_at,
                };
                res.json({
                    token: access_token,
                    refreshToken: refresh_token,
                    user: user_data,
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
    static sendResetPasswordOtp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const email = req.query.email;
            const reset_password_token = Utils_1.Utils.generateVerificationToken();
            try {
                const user = yield User_1.default.findOneAndUpdate({ email: email }, {
                    updated_at: new Date(),
                    reset_password_token: reset_password_token,
                    reset_password_token_time: Date.now() + new Utils_1.Utils().MAX_TOKEN_TIME,
                });
                if (user) {
                    res.json({ success: true });
                    yield NodeMailer_1.NodeMailer.sendMail({
                        to: [user.email],
                        subject: "Reset password email vertification otp",
                        html: `<h1>Your otp is ${reset_password_token}</h1>`,
                    });
                }
                else {
                    throw new Error("User doesn't exist");
                }
            }
            catch (e) {
                next(e);
            }
        });
    }
    static verifyResetPasswordToken(req, res, next) {
        res.json({ success: true });
    }
    static resetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.user;
            const new_password = req.body.new_password;
            try {
                const encryptedPassword = yield Utils_1.Utils.encryptPassword(new_password);
                const updatedUser = yield User_1.default.findByIdAndUpdate(user._id, {
                    updated_at: new Date(),
                    password: encryptedPassword,
                }, {
                    new: true,
                    projection: {
                        verification_token: 0,
                        verification_token_time: 0,
                        password: 0,
                        reset_password_token: 0,
                        reset_password_token_time: 0,
                        __v: 0,
                        _id: 0,
                    },
                });
                if (updatedUser) {
                    res.send(updatedUser);
                }
                else {
                    throw new Error("User doesn't exist");
                }
            }
            catch (e) {
                next(e);
            }
        });
    }
    static profile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.user;
            try {
                const profile = yield User_1.default.findById(user.aud);
                if (profile) {
                    const user_data = {
                        email: profile.email,
                        email_verified: profile.email_verified,
                        phone: profile.phone,
                        name: profile.name,
                        type: profile.type,
                        status: profile.status,
                        created_at: profile.created_at,
                        updated_at: profile.updated_at,
                    };
                    res.send(user_data);
                }
                else {
                    throw new Error("User doesn't exist");
                }
            }
            catch (e) {
                next(e);
            }
        });
    }
    static updatePhoneNumber(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.user;
            const phone = req.body.phone;
            try {
                const userData = yield User_1.default.findByIdAndUpdate(user.aud, { phone: phone, updated_at: new Date() }, {
                    new: true,
                    projection: {
                        verification_token: 0,
                        verification_token_time: 0,
                        password: 0,
                        reset_password_token: 0,
                        reset_password_token_time: 0,
                        __v: 0,
                        _id: 0,
                    },
                });
                res.send(userData);
            }
            catch (e) {
                next(e);
            }
        });
    }
    static updateUserProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.user;
            const phone = req.body.phone;
            const new_email = req.body.email;
            const plain_password = req.body.password;
            const verification_token = Utils_1.Utils.generateVerificationToken();
            try {
                const userData = yield User_1.default.findById(user.aud);
                if (!userData)
                    throw new Error("User doesn't exist");
                yield Utils_1.Utils.comparePassword({
                    password: plain_password,
                    encrypt_password: userData.password,
                });
                const updatedUser = yield User_1.default.findByIdAndUpdate(user.aud, {
                    phone: phone,
                    email: new_email,
                    email_verified: false,
                    verification_token,
                    verification_token_time: Date.now() + new Utils_1.Utils().MAX_TOKEN_TIME,
                    updated_at: new Date(),
                }, {
                    new: true,
                    projection: {
                        verification_token: 0,
                        verification_token_time: 0,
                        password: 0,
                        reset_password_token: 0,
                        reset_password_token_time: 0,
                        __v: 0,
                        _id: 0,
                    },
                });
                const payload = {
                    email: updatedUser.email,
                    type: updatedUser.type,
                };
                const access_token = Jwt_1.Jwt.jwtSign(payload, user.aud);
                const refresh_token = yield Jwt_1.Jwt.jwtSignRefreshToken(payload, user.aud);
                res.json({
                    token: access_token,
                    refreshToken: refresh_token,
                    user: updatedUser,
                });
                yield NodeMailer_1.NodeMailer.sendMail({
                    to: [updatedUser.email],
                    subject: "Email Verification",
                    html: `<h1>Your otp is ${verification_token}</h1>`,
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
    static getNewTokens(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const decoded_data = req.user;
            try {
                if (decoded_data) {
                    const payload = {
                        email: decoded_data.email,
                        type: decoded_data.type,
                    };
                    const access_token = Jwt_1.Jwt.jwtSign(payload, decoded_data.aud);
                    const refresh_token = yield Jwt_1.Jwt.jwtSignRefreshToken(payload, decoded_data.aud);
                    res.json({
                        accessToken: access_token,
                        refreshToken: refresh_token,
                    });
                }
                else {
                    req.errorStatus = 403;
                    throw "Access is forbidden";
                }
            }
            catch (e) {
                req.errorStatus = 403;
                next(e);
            }
        });
    }
    static logout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const decoded_data = req.user;
            try {
                if (decoded_data) {
                    res.json({ success: true });
                }
                else {
                    req.errorStatus = 403;
                    throw "Access is forbidden";
                }
            }
            catch (e) {
                req.errorStatus = 403;
                next(e);
            }
        });
    }
}
exports.UserController = UserController;
