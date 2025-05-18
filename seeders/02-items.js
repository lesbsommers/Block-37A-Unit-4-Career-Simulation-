//NYC Ferry Routes

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Items', [
      {
        name: 'Staten Island Ferry',
        description: 'Iconic free ferry running between Staten Island and Manhattan.',
        price: 0.00,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'East River Ferry',
        description: 'Connecting Manhattan, Brooklyn, Queens and the Bronx with scenic river views.',
        price: 2.75,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Governors Island Ferry',
        description: 'Seasonal ferry to Governors Island from Manhattan and Brooklyn.',
        price: 3.00,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'South Brooklyn Ferry',
        description: 'Connecting several South Brooklyn neighborhoods to Manhattan.',
        price: 2.75,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Items', null, {});
  },
};
