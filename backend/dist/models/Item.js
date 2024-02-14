"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
const itemSchema = new mongoose.Schema({
    restaurant_id: { type: mongoose.Types.ObjectId, ref: 'restaurants', required: true },
    category_id: { type: mongoose.Types.ObjectId, ref: 'categories', required: true },
    name: { type: String, required: true },
    description: { type: String },
    cover: { type: String, required: true },
    price: { type: Number, required: true },
    veg: { type: Boolean, required: true },
    status: { type: Boolean, required: true },
    created_at: { type: Date, required: true, default: new Date() },
    updated_at: { type: Date, required: true, default: new Date() }
});
exports.default = (0, mongoose_1.model)('items', itemSchema);
