'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const passwordHash = await bcrypt.hash('ferrypass123', 10);
    return queryInterface.bulkInsert('Users', [
      {
        username: 'nycfan',
        email: 'nycfan@example.com',
        password: passwordHash,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'ferrylover',
        email: 'ferrylover@example.com',
        password: passwordHash,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'dailycommuter',
        email: 'dailycommuter@example.com',
        password: passwordHash,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  },
};
