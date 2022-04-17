'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.user.hasOne(models.refresh_token, {
        foreignKey: "user_id", // custom column
        constraints: false
      });
    }
  };
  user.init({
    full_name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    password: DataTypes.STRING,
    avatar: DataTypes.STRING,
    hit: DataTypes.INTEGER,
    deleted_at: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'user',
    underscored: true,
    paranoid: true,
  });
  return user;
};