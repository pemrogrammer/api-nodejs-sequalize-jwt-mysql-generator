'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('role_abilities', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      role_id: {
       type: Sequelize.INTEGER,
       allowNull: false,
       references: {
         model: "roles",
         key: "id"
       },
       onDelete: "CASCADE"
      },
      ability_id: {
       type: Sequelize.INTEGER,
       allowNull: false,
       references: {
         model: "abilities",
         key: "id"
       },
       onDelete: "CASCADE"
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deleted_at: {
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('role_abilities');
  }
};