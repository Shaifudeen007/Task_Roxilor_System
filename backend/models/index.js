const sequelize = require('../config/db');
const User = require('./user');
const Store = require('./store');
const Rating = require('./rating');

// initialize models
const models = {
  User: User.initModel(sequelize),
  Store: Store.initModel(sequelize),
  Rating: Rating.initModel(sequelize)
};

// associations
models.User.hasMany(models.Rating, { foreignKey: 'userId', onDelete: 'CASCADE' });
models.Rating.belongsTo(models.User, { foreignKey: 'userId' });

models.Store.hasMany(models.Rating, { foreignKey: 'storeId', onDelete: 'CASCADE' });
models.Rating.belongsTo(models.Store, { foreignKey: 'storeId' });

models.User.hasMany(models.Store, { foreignKey: 'ownerId', as: 'ownedStores' });
models.Store.belongsTo(models.User, { foreignKey: 'ownerId', as: 'owner' });

module.exports = { ...models, sequelize };
