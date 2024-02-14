"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressValidators = void 0;
const express_validator_1 = require("express-validator");
class AddressValidators {
    static addAddress() {
        return [
            (0, express_validator_1.body)("title", "Title is required").isString(),
            (0, express_validator_1.body)("landmark", "Landmark is required").isString(),
            (0, express_validator_1.body)("address", "Address is required").isString(),
            (0, express_validator_1.body)("house", "House no. is required").isString(),
            (0, express_validator_1.body)("lat", "Latitude is required").isNumeric(),
            (0, express_validator_1.body)("lng", "Longitude is required").isNumeric(),
        ];
    }
    static editAddress() {
        return [
            (0, express_validator_1.body)("title", "Title is required").isString(),
            (0, express_validator_1.body)("landmark", "Landmark is required").isString(),
            (0, express_validator_1.body)("address", "Address is required").isString(),
            (0, express_validator_1.body)("house", "House no. is required").isString(),
            (0, express_validator_1.body)("lat", "Latitude is required").isNumeric(),
            (0, express_validator_1.body)("lng", "Longitude is required").isNumeric(),
        ];
    }
    static checkAddress() {
        return [
            (0, express_validator_1.query)("lat", "Latitude is required").isNumeric(),
            (0, express_validator_1.query)("lng", "Longitude is required").isNumeric(),
        ];
    }
    static getUserLimitedAddresses() {
        return [(0, express_validator_1.query)("limit", "Address limit is required").isNumeric()];
    }
}
exports.AddressValidators = AddressValidators;
