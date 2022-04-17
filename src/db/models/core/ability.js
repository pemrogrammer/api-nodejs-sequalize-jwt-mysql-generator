'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ability extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  ability.init({
    action: DataTypes.STRING,
    subject: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'ability',
    paranoid: true,
    underscored: true,
  });
  return ability;
};