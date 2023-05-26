'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('12345678', 10);
    const createdAt = new Date();
    const updatedAt = createdAt;

    await queryInterface.bulkInsert('Users', [
      {name: 'fakhrezi', password: hashedPassword, email:'rezi@gmail.com', createdAt, updatedAt },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
