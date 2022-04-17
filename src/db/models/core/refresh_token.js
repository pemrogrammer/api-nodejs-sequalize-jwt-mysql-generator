'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const config = require("@config/auth.config");
  const { v4: uuidv4 } = require("uuid");
  class refresh_token extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.refresh_token.belongsTo(models.user, {
        foreignKey: "user_id", // custom column
        constraints: false
      });
    }
    static createToken = async function (user) {
      let expired_at = new Date();

      expired_at.setSeconds(expired_at.getSeconds() + config.jwtRefreshExpiration);

      let _token = uuidv4();

      let refreshToken = await this.create({
        token: _token,
        user_id: user.id,
        expiry_date: expired_at.getTime(),
      });

      return refreshToken.token;
    };
    static verifyExpiration = (token) => {
      return token.expiry_date.getTime() < new Date().getTime();
    };
  };
  refresh_token.init({
    token: DataTypes.STRING,
    expiry_date: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'refresh_token',
    paranoid: true,
    underscored: true,
  });
  return refresh_token;
};