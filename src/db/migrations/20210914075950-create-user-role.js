'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_roles', {
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
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id"
        },
        onDelete: "CASCADE"
      },
      helper_unique: {
        type: Sequelize.INTEGER,
        unique: true
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
        // And here's where the trick takes place:
    // await queryInterface.addColumn(
    //   'Racer', // name of Source model
    //   'VehicleId', // name of the key we're adding
    //   {
    //     type: Sequelize.INTEGER,
    //     references: {
    //       model: 'Vehicle', // name of Target model
    //       key: 'id', // key in Target model that we're referencing
    //     },
    //     onUpdate: 'CASCADE',
    //     onDelete: 'SET NULL',
    //   }
    // );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_roles');
  }
};