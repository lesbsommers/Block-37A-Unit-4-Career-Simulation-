'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Comments', [
      {
        userId: 2,
        reviewId: 1,
        text: 'Totally agree! It\'s a must-do for any NYC visitor.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 3,
        reviewId: 2,
        text: 'Rush hour crowding is definitely a downside, but the views make up for it!',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 1,
        reviewId: 3,
        text: 'Governors Island is such a hidden gem during the summer!',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Comments', null, {});
  },
};
