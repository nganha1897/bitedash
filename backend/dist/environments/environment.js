"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnvironmentVariables = void 0;
const environment_dev_1 = require("./environment.dev");
const environment_prod_1 = require("./environment.prod");
;
function getEnvironmentVariables() {
    if (process.env.NODE_ENV === 'production') {
        return environment_prod_1.ProdEnvironment;
    }
    return environment_dev_1.DevEnvironment;
}
exports.getEnvironmentVariables = getEnvironmentVariables;
