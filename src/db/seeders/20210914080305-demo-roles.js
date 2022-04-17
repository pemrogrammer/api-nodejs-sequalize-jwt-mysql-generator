'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    return await queryInterface.bulkInsert('roles', [
      {
        id: 1,
        name: 'superadmin',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        name: 'admin',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        name: 'moderator',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 4,
        name: 'operator', // yo
        created_at: new Date(),
        updated_at: new Date()
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     return await queryInterface.bulkDelete('roles', null, {});
  }
};
