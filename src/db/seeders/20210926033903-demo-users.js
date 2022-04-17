'use strict';

var bcrypt = require("bcryptjs");

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
    return await queryInterface.bulkInsert('users', [
     {
       id: 1,
       full_name: 'Super Admin',
       email: 'superadmin@yogithesymbian.com',
       phone: '01',
       password: bcrypt.hashSync('password', 8),
       avatar: 'yogithesymbian.png',
       created_at: new Date(),
       updated_at: new Date()
     },
     {
       id: 2,
       full_name: 'Admin',
       email: 'admin@yogithesymbian.com',
       phone: '03',
       password: bcrypt.hashSync('password', 8),
       avatar: 'yogithesymbian.png',
       created_at: new Date(),
       updated_at: new Date()
     },
     {
       id: 3,
       full_name: 'Moderator',
       email: 'moderator@yogithesymbian.com',
       phone: '04',
       password: bcrypt.hashSync('password', 8),
       avatar: 'yogithesymbian.png',
       created_at: new Date(),
       updated_at: new Date()
     },
     {
       id: 4,
       full_name: 'Operator',
       email: 'operator@yogithesymbian.com',
       phone: '05',
       password: bcrypt.hashSync('password', 8),
       avatar: 'yogithesymbian.png',
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
     return await queryInterface.bulkDelete('users', null, {});
  }
};
