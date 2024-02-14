"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
const orderSchema = new mongoose.Schema({
    user_id: { type: mongoose.Types.ObjectId, ref: 'users', required: true },
    restaurant_id: { type: mongoose.Types.ObjectId, ref: 'restaurants', required: true },
    order: { type: String, required: true },
    instruction: { type: String },
    address: { type: Object, required: true },
    status: { type: String, required: true },
    total: { type: Number, required: true },
    grandTotal: { type: Number, required: true },
    deliveryCharge: { type: Number, required: true },
    payment_status: { type: Boolean, required: true },
    payment_mode: { type: String, required: true },
    payment_id: { type: String },
    created_at: { type: Date, required: true, default: new Date() },
    updated_at: { type: Date, required: true, default: new Date() },
});
exports.default = (0, mongoose_1.model)('orders', orderSchema);
