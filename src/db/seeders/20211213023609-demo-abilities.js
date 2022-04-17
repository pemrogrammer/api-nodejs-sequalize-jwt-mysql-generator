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
    return await queryInterface.bulkInsert('abilities', [
     {
       id: 1,
       action: 'manage',
       subject: 'all',
       created_at: new Date(),
       updated_at: new Date()
     },
     {
       id: 2,
       action: 'manage',
       subject: 'moderator',
       created_at: new Date(),
       updated_at: new Date()
     },
     {
       id: 3,
       action: 'manage',
       subject: 'operator',
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
     return await queryInterface.bulkDelete('abilities', null, {});
  }
};
