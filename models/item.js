'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    static associate(models) {
      Item.hasMany(models.Review);
    }
  }

  Item.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    averageRating: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Item',
  });

  return Item;
};
