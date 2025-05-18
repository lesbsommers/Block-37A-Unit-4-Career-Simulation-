'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      Comment.belongsTo(models.User);
      Comment.belongsTo(models.Review);
    }
  }

  Comment.init({
    text: DataTypes.TEXT,
    UserId: DataTypes.INTEGER,
    ReviewId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Comment',
  });

  return Comment;
};
