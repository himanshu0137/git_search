import * as Sequelize from 'sequelize';

export const SearchModel = function (sequelize: Sequelize.Sequelize, userModel: any)
{
    return sequelize.define(
        'search',
        {
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
