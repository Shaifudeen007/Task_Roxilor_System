const { Model, DataTypes } = require('sequelize');

class Rating extends Model {
  static initModel(sequelize) {
    Rating.init({
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      rating: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      storeId: { type: DataTypes.INTEGER, allowNull: false }
    }, {
      sequelize,
      modelName: 'Rating',
      tableName: 'ratings',
      indexes: [
        { unique: true, fields: ['userId', 'storeId'] } // one rating per user per store
      ]
    });
    return Rating;
  }
}

module.exports = Rating;
