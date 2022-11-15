"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.Role, {
        foreignKey: "role_code", //đây là khóa phụ của bảng user trỏ đến bảng role
        targetKey: "code", //đây là mã code của role
        as: "roleData", //roleData là thông tin lấy ra của role
      });
    }
  }
  User.init(
    {
      //tạo đối tượng user có 3 properties
      userName: DataTypes.STRING,
      password: DataTypes.STRING,
      email: DataTypes.STRING,
      avatar: DataTypes.STRING,
      role_code: DataTypes.STRING,
      refresh_token: DataTypes.STRING
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
