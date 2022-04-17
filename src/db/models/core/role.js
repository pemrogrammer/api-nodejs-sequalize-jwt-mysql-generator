'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // this.belongsToMany(models.role, {
      //   through: models.user_role,
      // });
    }
  };
  role.init({
    name: DataTypes.STRING,
  }, {
    sequelize,
    paranoid: true,
    modelName: 'role',
    underscored: true,
  });
  return role;
};