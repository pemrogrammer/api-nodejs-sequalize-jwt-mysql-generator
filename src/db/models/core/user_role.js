'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.role.belongsToMany(models.user, {
        through: models.user_role,
        foreignKey: "role_id", // to override snake_case
        otherKey: "user_id",// to override snake_case
      });
      models.user.belongsToMany(models.role, {
        through: models.user_role,
        foreignKey: "user_id",// to override snake_case
        otherKey: "role_id",// to override snake_case
      });
    }
  };
  user_role.init({
    role_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    helper_unique: DataTypes.INTEGER,

  }, {
    sequelize,
    paranoid: true,
    modelName: 'user_role',
    underscored: true,
  });
  return user_role;
};