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
    return await queryInterface.bulkInsert('role_abilities', [
     {
       id: 1,
       role_id: 1,
       ability_id: 1,
       created_at: new Date(),
       updated_at: new Date()
     },
     {
       id: 2,
       role_id: 2,
       ability_id: 2,
       created_at: new Date(),
       updated_at: new Date()
     },
     {
       id: 3,
       role_id: 2,
       ability_id: 3,
       created_at: new Date(),
       updated_at: new Date()
     },
     {
       id: 4,
       role_id: 3,
       ability_id: 3,
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
     return await queryInterface.bulkDelete('role_abilities', null, {});
  }
};
