import { UserModel } from './user';
import * as Sequelize from 'sequelize';
import { SearchModel } from './search';

export let models: IModels = {};
export function initModels(sequelize: Sequelize.Sequelize)
{
    models.User = UserModel(sequelize);
    models.Search = SearchModel(sequelize, models.User);
    sequelize.sync();
}

interface IModels
{
    [x: string]: Sequelize.Model<any, any>;
}
