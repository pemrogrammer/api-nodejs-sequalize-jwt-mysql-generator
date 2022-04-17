
"use strict";
const {
  Model
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class company extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
       models.company.belongsTo(models.user, { foreignKey: 'user_id', constraint: false, }); 
    }
  };
  company.init({
     user_id: DataTypes.INTEGER, 
     name: DataTypes.STRING, 
    // code here
  }, {
    sequelize,
    modelName: "company",
    paranoid: true,
    underscored: true,
  });
  return company;
};
            
