'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      Review.belongsTo(models.User);
      Review.belongsTo(models.Item);
      Review.hasMany(models.Comment, { onDelete: 'CASCADE' });
    }
  }

  Review.init({
    text: DataTypes.TEXT,
    rating: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    ItemId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Review',
  });

  return Review;
};
