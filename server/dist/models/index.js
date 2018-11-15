"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var User_1 = require("./User");
var search_1 = require("./search");
exports.models = {};
function initModels(sequelize) {
    exports.models.User = User_1.UserModel(sequelize);
    exports.models.Search = search_1.SearchModel(sequelize, exports.models.User);
    sequelize.sync();
}
exports.initModels = initModels;
