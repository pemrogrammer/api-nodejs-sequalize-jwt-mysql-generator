'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class role_ability extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
     models.ability.belongsToMany(models.role, {
       through: models.role_ability,
       foreignKey: "ability_id",
       otherKey: "role_id",
     });
     models.role.belongsToMany(models.ability, {
       through: models.role_ability,
       foreignKey: "role_id",
       otherKey: "ability_id",
     });
    }
  };
  role_ability.init({
    role_id: DataTypes.INTEGER,
    ability_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'role_ability',
    paranoid: true,
    underscored: true,
  });
  return role_ability;
};