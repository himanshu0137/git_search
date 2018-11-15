"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Sequelize = require("sequelize");
exports.SearchModel = function (sequelize, userModel) {
    return sequelize.define('search', {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV1,
            primaryKey: true
        },
        user: {
            type: Sequelize.UUID,
            references: {
                model: userModel,
                key: 'id'
            }
        },
        term: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });
};
