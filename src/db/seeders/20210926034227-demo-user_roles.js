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
    return await queryInterface.bulkInsert('user_roles', [
     {
       id: 1,
       role_id: 1,
       user_id: 1,
       helper_unique: 11,
       created_at: new Date(),
       updated_at: new Date()
     },
     {
       id: 2,
       role_id: 2,
       user_id: 2,
       helper_unique: 22,
       created_at: new Date(),
       updated_at: new Date()
     },
     {
       id: 3,
       role_id: 3,
       user_id: 3,
       helper_unique: 33,
       created_at: new Date(),
       updated_at: new Date()
     },
     {
       id: 4,
       role_id: 4,
       user_id: 4,
       helper_unique: 44,
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
     return await queryInterface.bulkDelete('user_roles', null, {});
  }
};
