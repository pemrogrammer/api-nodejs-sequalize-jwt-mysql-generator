'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tokens', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
       type: Sequelize.INTEGER,
       allowNull: false,
       references: {
         model: "users",
         key: "id"
       },
       onDelete: "CASCADE"
      },
      token: {
        type: Sequelize.STRING
      },
      expires: {
        allowNull: true,
        type: Sequelize.DATE,
        default: Sequelize.DATE,
      },
      hit_create: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        default: Sequelize.DATE,
        // expires: 60,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        // expires: 60,
      },
      deleted_at: {
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('tokens');
  }
};