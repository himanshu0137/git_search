import * as Sequelize from 'sequelize';
import * as bcrypt from 'bcrypt-nodejs';

export const UserModel = function (sequelize: Sequelize.Sequelize)
{
    return sequelize.define(
        'user',
        {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV1,
                primaryKey: true
            },
            firstName: {
                type: Sequelize.STRING
            },
            lastName: {
                type: Sequelize.STRING
            },
            userName: {
                type: Sequelize.STRING,
                unique: true
            },
            password: {
                type: Sequelize.STRING,
                unique: true
            },
            facebookId: {
                type: Sequelize.STRING
            },
            googleId: {
                type: Sequelize.STRING,
                unique: true
            }
        });
};
