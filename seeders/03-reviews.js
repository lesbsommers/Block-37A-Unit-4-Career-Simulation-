'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Reviews', [
      {
        userId: 1,
        itemId: 1,
        text: 'Love the Staten Island Ferry! Great views of the Statue of Liberty and free of charge.',
        rating: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        itemId: 2,
        text: 'The East River Ferry is a relaxing way to commute, but sometimes it gets crowded during rush hour.',
        rating: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 3,
        itemId: 3,
        text: 'Governors Island Ferry is perfect for weekend getaways. Friendly staff and quick boarding.',
        rating: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 1,
        itemId: 4,
        text: 'South Brooklyn Ferry connects my neighborhood smoothly. Wish the schedule was a bit more frequent.',
        rating: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Reviews', null, {});
  },
};
